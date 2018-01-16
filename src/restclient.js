import prepareRequest from './prepareRequest'
import config from './config'

class GlpiRestClient { 
    constructor (url, appToken = '') {
        config.url = url
        config.appToken = appToken
        config.sessionToken = ''
    }

    get url () {
        return config.url
    }

    set url (url) {
        config.url = url
    }

    get sessionToken () {
        return config.sessionToken
    }

    set sessionToken (sessionToken) {
        config.sessionToken = sessionToken
    }

    get appToken () {
        return config.appToken
    }

    set appToken (appToken) {
        config.appToken = appToken
    }

    _makeRequest (myRequest, funct, responseHandler) {
        fetch (myRequest)
            .then((resp) => {        
  
                switch (funct) {

                    case 'initSessionByCredentials':
                    case 'initSessionByUserToken':
                        responseHandler(resp.json())
                    break

                    case 'killSession':
                        if (resp.ok) {
                            responseHandler(resp.text())                            
                        } else {
                            responseHandler(resp.json()) 
                        }
                    break
                    
                    default:
                        responseHandler(resp.text())
                    break
                }

            }) 
            .catch((err) => {
                responseHandler(err)
            })
    }

    initSessionByCredentials (userName, userPassword) {
        return new Promise((resolve, reject) => {
            try {
                const data = {
                    function: 'initSessionByCredentials',
                    userName,
                    userPassword
                }
                this._makeRequest( prepareRequest(data), 'initSessionByCredentials', (promise) => {
                    promise.then(response => {
                        console.log('response')
                        console.log(response)
                        if (response.session_token) {
                            config.sessionToken = response.session_token
                        }
                        resolve ( response ) 
                    })
                })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    initSessionByUserToken (userToken) {
        return new Promise((resolve, reject) => {
            try {
                const data = {
                    function: 'initSessionByUserToken',
                    userToken
                }
                this._makeRequest( prepareRequest(data), 'initSessionByUserToken', (promise) => {
                    promise.then(response => {
                        if (response.session_token) {
                            config.sessionToken = response.session_token
                        }
                        resolve ( response ) 
                    })
                })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    killSession () {
        return new Promise((resolve, reject) => {
            try {
                const data = {
                    function: 'killSession'
                }
                this._makeRequest( prepareRequest(data), 'killSession', (promise) => {
                    promise.then(response => {
                        config.sessionToken = ''
                        resolve ( response ) 
                    })
                })
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

export default GlpiRestClient