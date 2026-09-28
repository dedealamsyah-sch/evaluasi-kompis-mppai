const Table = require('cli-table3');
const fs = require('fs');

const stopWords = new Set([
  'yang', 'di', 'dan', 'dari', 'itu', 'dengan', 'untuk', 'adalah', 'pada', 'dalam', 
  'ke', 'ini', 'oleh', 'sebagai', 'tidak', 'atau', 'akan', 'menjadi', 'tersebut', 
  'dari', 'untuk', 'agar', 'bisa', 'dapat', 'oleh', 'para', 'juga', 'saat',
  'saya', 'kami', 'kita', 'mereka', 'ia', 'dia', 'anda', 'kamu', 'apa', 'mengapa', 
  'bagaimana', 'kapan', 'dimana', 'mana', 'siapa', 'ia', 'bahwa', 'namun', 'tetapi',
  'serta', 'jika', 'bila', 'ketika', 'setelah', 'sebelum', 'hingga', 'sampai'
]);

function tokenize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word && !stopWords.has(word));
}

function getTF(tokens) {
  const tf = {};
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  return tf;
}

function getIDF(documents) {
  const idf = {};
  const totalDocs = documents.length;
  const wordDocCount = {};

  documents.forEach(tokens => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach(token => {
      wordDocCount[token] = (wordDocCount[token] || 0) + 1;
    });
  });

  for (const token in wordDocCount) {
    idf[token] = Math.log(totalDocs / wordDocCount[token]);
  }
  return idf;
}

function getVector(tokens, tf, idf) {
  const vector = {};
  tokens.forEach(token => {
    vector[token] = tf[token] * (idf[token] || 1);
  });
  return vector;
}

function cosineSimilarity(vec1, vec2) {
  const allTokens = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  allTokens.forEach(token => {
    const val1 = vec1[token] || 0;
    const val2 = vec2[token] || 0;
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  });

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

function calculateSimilarity(text1, text2) {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  const documents = [tokens1, tokens2];
  
  const idf = getIDF(documents);
  const tf1 = getTF(tokens1);
  const tf2 = getTF(tokens2);
  
  const vec1 = getVector(tokens1, tf1, idf);
  const vec2 = getVector(tokens2, tf2, idf);
  
  return cosineSimilarity(vec1, vec2);
}

module.exports = { calculateSimilarity, tokenize };

if (require.main === module) {
  const datasets = [
    {
      doc1: "Pemerintah berencana menerapkan kurikulum baru tahun depan untuk meningkatkan kualitas pendidikan di Indonesia.",
      doc2: "Kualitas pendidikan Indonesia akan ditingkatkan melalui penerapan kurikulum baru oleh pemerintah tahun depan."
    },
    {
      doc1: "Tim nasional sepak bola Indonesia menang telak melawan Malaysia di pertandingan persahabatan semalam.",
      doc2: "Pasar saham melemah sore ini karena ketidakpastian ekonomi global yang terus berlanjut."
    }
  ];

  const table = new Table({
    head: ['Dokumen 1', 'Dokumen 2', 'Skor Kemiripan (%)'],
    colWidths: [40, 40, 25]
  });

  const results = datasets.map(data => {
    const score = calculateSimilarity(data.doc1, data.doc2);
    const scorePercentage = (score * 100).toFixed(2);
    table.push([data.doc1.substring(0, 37) + '...', data.doc2.substring(0, 37) + '...', scorePercentage + '%']);
    return { ...data, score: scorePercentage };
  });

  console.log(table.toString());
  fs.writeFileSync('similarity_result.json', JSON.stringify(results, null, 2));
  console.log("Results saved to similarity_result.json");
}
