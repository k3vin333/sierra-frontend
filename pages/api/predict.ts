// /api/predict/predict.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { lag_1, lag_2, lag_3 } = req.query;

    if (!lag_1 || !lag_2 || !lag_3) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const response = await fetch(
            `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/predict?lag_1=${lag_1}&lag_2=${lag_2}&lag_3=${lag_3}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch from SageMaker");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (err: any) {
        console.error("Proxy error:", err.message);
        res.status(500).json({ error: "Prediction fetch failed" });
    }
}
