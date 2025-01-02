import axios from "axios";

export const getTweets = async(url:string,cashtag:string) =>{
    const response = await axios.get(`http://localhost:3000/twitter?username=${url}&cashtag=${cashtag}`)
    const responseArray = response?.data.split('\n- ').map(item => item.trim());
    return responseArray;
}