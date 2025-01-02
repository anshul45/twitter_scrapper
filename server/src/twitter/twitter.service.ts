import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { ActorRun, ApifyClient } from 'apify-client';
import { OpenAIResponseData, OpenAIWrapper } from "src/modules/openai/openai.service"; 
dotenv.config();

interface InputData {
    username: string;
    max_posts: number;
}


@Injectable()
export class TwitterService {
    private client: ApifyClient;
    private input: InputData;
    private tweets:Record<string | number, unknown>[];
    private allTwitts :unknown[]
    
    constructor(
        private readonly openAiService: OpenAIWrapper
    ) {
        const apiKey = process.env.APIFY_API_KEY;
        if (!apiKey) {
            throw new Error("Apify API key is required. Set it in environment.");
        }
        this.client = new ApifyClient({ token: apiKey });
        this.input = { username: "", max_posts: 500};
    }

    async getTweets(username: string,cashtag:string):Promise<OpenAIResponseData>{
        if (username) {
            this.input.username = username;
        }

        try {
            const run: ActorRun = await this.client.actor("SfyC2ifoAKkAUvjTt").call(this.input);
            const {items} = await this.client.dataset(run.defaultDatasetId).listItems();
            if(items)
            {
                this.tweets = items;
            }

        this.allTwitts = this.tweets.map(tweet => tweet.text)

        //@ts-ignore
        const filteredMessages = this.allTwitts.filter(message => message.includes(`$${cashtag}`));

        const userPrompt = filteredMessages.join('\n')
            
        const response = await this.openAiService.generateResponse(userPrompt,"You are a supportive ai agent you have to analyze text and make bullet point.")   
    
        return response
       
    } catch (error) {
            console.error("Error fetching tweets:", error);
            throw new Error("Failed to fetch tweets.");
        }
    }

}
