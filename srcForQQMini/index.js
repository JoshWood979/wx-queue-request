import q from './queue'

function queueRequest(request, concurrency = 10) {
    if (typeof request !== 'function') {
        throw Error('request must be function')
    }
    const queue = q((task, callback) => task(callback), concurrency)

    return (obj) => {
        queue.push((callback) => {
            const originComplete = obj.complete
            obj.complete = (...args) => {
                callback()
                if (typeof originComplete === 'function') {
                    originComplete(...args)
                }
            }
            request(obj)
        })
    }
}

function queue(concurrency) {
    const request = wx.request

    Object.defineProperty(wx, 'request', {
        get() {
            return queueRequest(request, concurrency)
        }
    })
    
    const QQrequest =qq.request;
    Object.defineProperty(qq, 'request', {
        get() {
            return queueRequest(QQrequest, concurrency)
        }
    })

    const wxDownloadFile = wx.downloadFile ;
    
    Object.defineProperty(wx, 'downloadFile', {
        get() {
            return queueRequest(wxDownloadFile, concurrency)
        }
    })
    
    const qqDownloadFile = qq.downloadFile ;
    
    Object.defineProperty(qq, 'downloadFile', {
        get() {
            return queueRequest(qqDownloadFile, concurrency)
        }
    })
}

export {
    queueRequest,
    queue,
}
