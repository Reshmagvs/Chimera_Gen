export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export interface ColumnProfile {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime' | 'unknown';
  uniqueCount: number;
  missingCount: number;
  mean?: number;
  min?: number;
  max?: number;
  std?: number;
  categories?: { [key: string]: number }; // frequency map
}

export interface Dataset {
  id: string;
  name: string;
  rows: DataRow[];
  columns: string[];
  profile: ColumnProfile[];
  createdAt: string;
}

export enum ModelType {
  CTGAN = 'CTGAN',
  VAE = 'VAE',
}

export interface TrainingParams {
  epochs: number;
  batchSize: number;
  embeddingDim?: number;
  latentDim?: number;
  modelType: ModelType;
}

export interface ModelArtifact {
  id: string;
  datasetId: string;
  name: string;
  type: ModelType;
  params: TrainingParams;
  status: 'training' | 'ready' | 'failed';
  trainingLoss: number[];
  schemaDescription: string; // The LLM context derived from training
  columns: ColumnProfile[]; // Added to store structural schema for generation
}

export interface ValidationMetrics {
  ksTestAvg: number; // Kolmogorov-Smirnov
  correlationDistance: number;
  privacyScore: number; // Nearest neighbor distance
  duplicates: number;
}

export interface GeneratedDataset {
  id: string;
  modelId: string;
  rows: DataRow[];
  createdAt: string;
  validation?: ValidationMetrics;
}