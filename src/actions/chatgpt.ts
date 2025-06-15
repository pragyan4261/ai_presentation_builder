'use server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const generateCreativePrompt = async (userPrompt: string) => {
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const finalPrompt = `
        Create a coherent and relevant outline 
        for the following prompt:
        ${userPrompt}

        The outline should consist of at least 6 points,
        with each point written as a single sentence.
        Ensure the outline is well structured and directly related
        to the topic.
        Return the output in the following JSON format:
        {
            "outline": [
                "Point 1",
                "Point 2",
                "Point 3",
                "Point 4",
                "Point 5",
                "Point 6"
            ]
        }
        
        Ensure that the JSON is valid and properly formatted.
        Do not include any other text or explanations outside the JSON
    `

    try {
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `You are a helpful AI assistant that generates outlines based on user prompts for presentations. ${finalPrompt}`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.0,
                maxOutputTokens: 1000,
            }
        })

        const responseContent = result.response.text()
        
        if (responseContent) {
            try {
                // Clean the response in case there are markdown code blocks or extra text
                const cleanedResponse = responseContent
                    .replace(/```json\s*/g, '')
                    .replace(/```\s*/g, '')
                    .trim()
                
                const jsonResponse = JSON.parse(cleanedResponse)
                return { status: 200, data: jsonResponse }
            } catch (error) {
                console.error('JSON parsing error:', responseContent, error)
                return { status: 500, error: 'Invalid JSON response from Gemini API' }
            }
        }

        return { status: 400, error: 'No content returned from Gemini API' }
    } catch (error) {
        console.error('Gemini API error:', error)
        return { status: 500, error: 'Error communicating with Gemini API' }
    }
}

// 'use server'
// import { OpenAI } from 'openai'
// import { tracingChannel } from "diagnostics_channel"
// import { data } from '@/lib/constants'

// export const generateCreativePrompt = async(userPrompt:string)=>{
    
//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY,
//         baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
//     })
    
//     const finalPrompt = `
//         Create a coherent and relevant outline 
//         for the following prompt:
//         ${userPrompt}

//         The outline should consist of at least 6 points,
//         with each point written as a single sentence.
//         Ensure the outline is well structured and directyl related
//         to the topic.
//         Return the output in the following JSON format:
//         {
//             "outline": [
//                 "Point 1",
//                 "Point 2",
//                 "Point 3",
//                 "Point 4",
//                 "Point 5",
//                 "Point 6"
//             ]
//         }
        
//         Ensure that the JSON is valid and properly formatted.
//         Do not include any other txt or explanations outside the JSON
//     `

//     try {
//         const completion = await openai.chat.completions.create({
//             model: 'gpt-4.0',
//             messages: [
//                 {
//                     role: 'system',
//                     content: 'You are a helpful AI assistant that generates outlines based on user prompts. for presentations'
//                 },
//                 {
//                     role: 'user',
//                     content: finalPrompt
//                 }
//             ],
//             max_tokens: 1000,
//             temperature: 0.0,
//         })

//         const responseContent = completion.choices[0].message?.content
//         if(responseContent){
//             try {
//                 const jsonResponse = JSON.parse(responseContent);
//                 return {status : 200, data: jsonResponse};
//             } catch (error) {
//                 console.error('JSON parsing error:', responseContent,error);
//                 return {status: 500, error: 'Invalid JSON response from OpenAI'};
//             }
//         }

//         return {status: 400, error: 'No content returned from OpenAI'};
//     } catch (error) {
//         console.error('OpenAI API error:', error);
//         return {status: 500, error: 'Error communicating with OpenAI API'};
//     }
// }