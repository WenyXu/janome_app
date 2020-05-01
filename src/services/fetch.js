import requset from '../utils/request'

export async function fetch(text){
    return requset('/',{
        method:'POST',
        data:{
            text
        }
    })
}