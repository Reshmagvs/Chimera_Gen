import { DataRow, ColumnProfile } from '../types';

// Helper to parse CSV text
export const parseCSV = (text: string): DataRow[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(','); // Simple split, doesn't handle quoted commas for simplicity
    const row: DataRow = {};
    headers.forEach((header, index) => {
      const val = values[index]?.trim();
      // Attempt type inference
      if (val === undefined || val === '') {
        row[header] = null;
      } else if (!isNaN(Number(val))) {
        row[header] = Number(val);
      } else if (val.toLowerCase() === 'true') {
        row[header] = true;
      } else if (val.toLowerCase() === 'false') {
        row[header] = false;
      } else {
        row[header] = val;
      }
    });
    return row;
  });
};

export const convertToCSV = (rows: DataRow[]): string => {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const headerLine = headers.join(',');
  const dataLines = rows.map(row => 
    headers.map(field => {
      const val = row[field];
      return val === null || val === undefined ? '' : String(val);
    }).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
};

export const profileData = (rows: DataRow[], columns: string[]): ColumnProfile[] => {
  return columns.map(col => {
    const values = rows.map(r => r[col]);
    const nonNull = values.filter(v => v !== null && v !== undefined);
    
    // Determine type based on majority
    const numCount = nonNull.filter(v => typeof v === 'number').length;
    const isNumeric = numCount > nonNull.length * 0.9;
    
    const profile: ColumnProfile = {
      name: col,
      type: isNumeric ? 'numeric' : 'categorical', // Simplified detection
      uniqueCount: new Set(values).size,
      missingCount: values.length - nonNull.length
    };

    if (isNumeric) {
      const nums = nonNull.map(v => Number(v));
      const sum = nums.reduce((a, b) => a + b, 0);
      profile.mean = sum / nums.length;
      profile.min = Math.min(...nums);
      profile.max = Math.max(...nums);
      // Calc std dev
      const variance = nums.reduce((a, b) => a + Math.pow(b - profile.mean!, 2), 0) / nums.length;
      profile.std = Math.sqrt(variance);
    } else {
      // Frequency for categorical
      const freq: { [key: string]: number } = {};
      nonNull.forEach(v => {
        const s = String(v);
        freq[s] = (freq[s] || 0) + 1;
      });
      profile.categories = freq;
    }
    return profile;
  });
};

// Kolmogorov-Smirnov Test Statistic (Simplified for 2 samples)
export const calculateKS = (data1: number[], data2: number[]): number => {
  const sorted1 = [...data1].sort((a, b) => a - b);
  const sorted2 = [...data2].sort((a, b) => a - b);
  
  const allValues = new Set([...sorted1, ...sorted2]);
  const sortedAll = Array.from(allValues).sort((a, b) => a - b);
  
  let maxD = 0;
  
  for (const x of sortedAll) {
    // CDF(x) = count of values <= x / total count
    const cdf1 = sorted1.filter(v => v <= x).length / sorted1.length;
    const cdf2 = sorted2.filter(v => v <= x).length / sorted2.length;
    const diff = Math.abs(cdf1 - cdf2);
    if (diff > maxD) maxD = diff;
  }
  
  return maxD;
};

// Pearson Correlation Coefficient
export const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.map((v, i) => v * y[i]).reduce((a, b) => a + b, 0);
  const sumX2 = x.map(v => v * v).reduce((a, b) => a + b, 0);
  const sumY2 = y.map(v => v * v).reduce((a, b) => a + b, 0);

  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

export const calculateMatrix = (rows: DataRow[], columns: string[]) => {
    // Filter numeric columns
    const numericCols = columns.filter(c => rows.some(r => typeof r[c] === 'number'));
    const matrix: { x: string, y: string, value: number }[] = [];

    for (let i = 0; i < numericCols.length; i++) {
        for (let j = 0; j < numericCols.length; j++) {
            const col1 = numericCols[i];
            const col2 = numericCols[j];
            const val1 = rows.map(r => Number(r[col1]) || 0);
            const val2 = rows.map(r => Number(r[col2]) || 0);
            const corr = calculateCorrelation(val1, val2);
            matrix.push({ x: col1, y: col2, value: corr });
        }
    }
    return matrix;
}

// Distance to Nearest Neighbor (Privacy Metric)
export const calculatePrivacyMetrics = (realRows: DataRow[], synRows: DataRow[], numericCols: string[]) => {
  if (realRows.length === 0 || synRows.length === 0 || numericCols.length === 0) {
    return { minDistance: 0, duplicates: 0 };
  }

  // Normalize data for fair distance calculation (0-1 scale)
  const stats = numericCols.map(col => {
    const vals = realRows.map(r => Number(r[col]));
    return { col, min: Math.min(...vals), max: Math.max(...vals) };
  });

  const normalize = (row: DataRow) => {
    return stats.map(s => {
      const val = Number(row[s.col]);
      if (s.max === s.min) return 0;
      return (val - s.min) / (s.max - s.min);
    });
  };

  const realVectors = realRows.map(normalize);
  const synVectors = synRows.map(normalize);

  let minGlobalDistance = Infinity;
  let duplicates = 0;

  // Check a sample of synthetic rows against all real rows to save time
  const sampleSize = Math.min(synVectors.length, 100);
  for (let i = 0; i < sampleSize; i++) {
    const synVec = synVectors[i];
    let minRowDist = Infinity;
    
    for (let j = 0; j < realVectors.length; j++) {
      const realVec = realVectors[j];
      let distSq = 0;
      for (let k = 0; k < synVec.length; k++) {
        distSq += Math.pow(synVec[k] - realVec[k], 2);
      }
      const dist = Math.sqrt(distSq);
      if (dist < minRowDist) minRowDist = dist;
    }

    if (minRowDist < 0.001) duplicates++; // Effectively a copy
    if (minRowDist < minGlobalDistance) minGlobalDistance = minRowDist;
  }

  return { minDistance: minGlobalDistance, duplicates };
};