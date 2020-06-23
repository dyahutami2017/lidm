'use strict'

const Drive = use('Drive');
const lookup = require('mime-types').lookup
const ft = require('file-type')

class AssetController {
    async getFile({params, request, response}){
        const fileName = params.file;

        if(await Drive.exists(fileName)){
            const file = await Drive.get(fileName)
            response.header('content-type', ft(file).mime)
            response.header('content-length', Buffer.byteLength(file))

            return response.send(file)
        }else{
            return response.status(404).send();
        }
    }
}

module.exports = AssetController
