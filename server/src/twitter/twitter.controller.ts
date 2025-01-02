import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Query,
} from "@nestjs/common";
import { TwitterService } from "./twitter.service";

@Controller("twitter")
export class TwitterController {
    constructor(private readonly twitter: TwitterService) {}

    @Get()
    async processText(
        @Query("username") username: string,
        @Query("cashtag") cashtag: string,
    ) {
        try {
          const result = await this.twitter.getTweets(username,cashtag)
          console.log(result)
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error processing text",
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
