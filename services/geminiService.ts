import { GoogleGenAI, Type } from "@google/genai";
import { Dataset, ModelType, TrainingParams, ModelArtifact } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  return new GoogleGenAI({ apiKey });
};

// Simulates the "Training" phase by having Gemini analyze the data distribution schema
export const trainModel = async (dataset: Dataset, params: TrainingParams, modelName: string): Promise<ModelArtifact> => {
  const ai = getClient();
  
  // Sample data to save tokens, but enough to get patterns
  const sampleSize = Math.min(dataset.rows.length, 50);
  const sampleRows = dataset.rows.slice(0, sampleSize);
  const schemaStr = JSON.stringify(dataset.profile.map(p => ({
    name: p.name, type: p.type, min: p.min, max: p.max, categories: p.categories ? Object.keys(p.categories).slice(0, 10) : null
  })));

  const prompt = `
    Analyze this tabular dataset schema and sample data. 
    Task: Create a highly detailed internal representation of the data distribution, relationships between columns, and formatting rules.
    This will be used to generate synthetic data later that matches this statistical profile.
    
    Dataset Name: ${dataset.name}
    Model Type: ${params.modelType} (Simulate this behavior)
    Schema Profile: ${schemaStr}
    Sample Data (First ${sampleSize} rows): ${JSON.stringify(sampleRows)}

    Output a text summary describing the statistical properties, correlations you observe, and constraints.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return {
    id: crypto.randomUUID(),
    datasetId: dataset.id,
    name: modelName,
    type: params.modelType,
    params,
    status: 'ready',
    trainingLoss: Array.from({ length: 20 }, (_, i) => Math.exp(-i * 0.1) + Math.random() * 0.05), // Fake loss curve
    schemaDescription: response.text || "Analysis failed",
    columns: dataset.profile // Store the column profile for schema generation
  };
};

export const generateSyntheticData = async (
  model: ModelArtifact, 
  count: number,
  onProgress?: (count: number) => void
): Promise<any[]> => {
  const ai = getClient();
  const batchSize = 10; // Generate in small batches to ensure JSON validity
  const totalBatches = Math.ceil(count / batchSize);
  let allRows: any[] = [];

  // Construct dynamic schema properties based on trained model columns
  const properties: Record<string, any> = {};
  if (model.columns && model.columns.length > 0) {
      model.columns.forEach(col => {
          properties[col.name] = {
              type: col.type === 'numeric' ? Type.NUMBER : Type.STRING,
              nullable: true,
          };
      });
  } else {
      // Fallback for empty models (shouldn't happen with valid training)
      properties['data'] = { type: Type.STRING };
  }

  for (let i = 0; i < totalBatches; i++) {
    const currentCount = Math.min(batchSize, count - allRows.length);
    
    const prompt = `
      You are a synthetic data generator engine.
      Reference Analysis: ${model.schemaDescription}
      
      Task: Generate ${currentCount} new rows of data.
      Format: JSON Array of objects.
      Constraints:
      1. Strictly follow the inferred schema types (numbers stay numbers, dates stay dates).
      2. Respect the min/max bounds and category distributions observed in the analysis.
      3. Maintain correlations between columns.
      4. DO NOT output any markdown code blocks, just the raw JSON.
      
      Response Schema:
      Array of Objects.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
             type: Type.ARRAY,
             items: {
                 type: Type.OBJECT,
                 properties: properties
             }
          }
        }
      });

      const text = response.text || "[]";
      let newRows = [];
      try {
          newRows = JSON.parse(text);
      } catch(e) {
          console.error("JSON parse error", e);
      }
      
      if (Array.isArray(newRows)) {
        allRows = [...allRows, ...newRows];
      }
      
      if (onProgress) onProgress(allRows.length);

    } catch (e) {
      console.error("Generation batch failed", e);
      throw e; // Re-throw to inform UI
    }
  }

  return allRows;
};