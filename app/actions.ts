"use server"
import { BigQuery } from '@google-cloud/bigquery';

export async function getAIData() {
  const bigquery = new BigQuery({
      projectId: 'project-378f1530-eea8-4d9e-80f',
      // keyFilename: 'path/to/your/service-account.json' // Si lo corres local sin gcloud login
  });

  const query = `
    SELECT 
        product_id, 
        precio_justo_ia, 
        ahorro_pct,
        CASE 
            WHEN ahorro_pct > 10 THEN '🔥 SUPER OFERTA'
            WHEN ahorro_pct > 0 THEN '✅ Buen Precio'
            ELSE '⚖️ Precio Justo'
        END as veredicto
    FROM \`project-378f1530-eea8-4d9e-80f.price_monitor_dw.ai_market_analysis\`
  `;

  const [rows] = await bigquery.query(query);
  return rows;
}