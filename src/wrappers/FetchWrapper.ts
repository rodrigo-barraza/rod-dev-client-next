import UtilityLibrary from "../libraries/UtilityLibrary";

const FetchWrapper = {
    async fetch (method: string, url: string, headers: Headers, body: object, searchParams: object ) {
        let data, error, response;
        try {
            const mergedHeaders = new Headers({
                'Content-Type': 'application/json',
            })
            
            for (const [key,value] of headers.entries()) {
                mergedHeaders.append(key, value)
            }


            const mergedUrl = `${url}?${searchParams.toString()}`
            response = await fetch(mergedUrl, {
                method: method,
                headers: mergedHeaders,
                body: !UtilityLibrary.isObjectEmpty(body) ? JSON.stringify(body) : undefined
            }); 

            if (response.ok) {
                const result = await response.text()
                const parsedResult = JSON.parse(result)
                data = parsedResult.data || parsedResult

            } else {
                error = response
            }
                
        } catch (err) {
            error = err
        }
        return { data, error, response }
    }
};

export default FetchWrapper;
