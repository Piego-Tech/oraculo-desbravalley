import { generateAnswer } from "@/core/oracle";
import { NextApiRequest, NextApiResponse } from "next";

const handle = async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    if (req.method === 'POST') {
      try {
        const { question } = req.body
        const answer = await generateAnswer(question);
        
        if (answer) {
            res.status(200).json({answer});
            return;
        }
  
        res.status(400).json({msg: 'Falied'});
        return;
  
      } catch (error) {
        console.log("🚀 ~ error:", error)
  
        res.status(500).json({ error: 'Something went wrong.' })
      }
    }
}

export default handle;