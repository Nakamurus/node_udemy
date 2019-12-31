const fs = require('fs');

const requestHandler = (req, res) => {
    if (req.url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>')
        res.write('<body><form method="POST" action="/msg"><input type="text" name="msg"><button type="submit">SEND</button></form></body>')
        // POSTならform が必要だが、中のinputを自動で探知する
        res.write('</html>');
        return res.end();
    }
    if (req.url ==='/msg' && req.method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            // req.onはイベントリスナー
            // req/on('data', )は新しいチャンクが用意できる度に発火
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            // req.on('end', )は入力要求データのパーシングが終わったら発火
            const parsedBody = Buffer.concat(body).toString();
            // Bufferでバッファを作り、concatでbodyからのチャンクをすべて足す。その後、toString()で文字列に
            const msg = parsedBody.split('=')[1];
            fs.writeFile('msg.txt', msg, err => {
                // fs.writeFileは入力データが無いといけないので、ここに入れる
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        })
    }
    // 下の行は、上のコールバック関数が発火する前に返される  
    // res.setHeader('Content-Type', 'text/html');
    // res.write('<html>');
    // res.write('<head><title>My First Page</title></head>');
    // res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
    // res.write('</html>');
    // res.end();
};

// module.exports = requestHandler;

// module.exports = {
//     handler: requestHandler,
//     someText: 'Some hard coded text'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some text';

exports.handler = requestHandler;
exports.someText = 'Some hard coded text';