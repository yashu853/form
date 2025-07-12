const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AJAX Form</title>
      </head>
      <body>
        <form id="myForm">
          <input type="text" name="message" id="message" />
          <button type="submit">Send</button>
        </form>
        <p id="status"></p>

        <script>
          const form = document.getElementById('myForm');
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = document.getElementById('message').value;

            fetch('/message', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: 'message=' + encodeURIComponent(msg)
            }).then(res => {
              if (res.ok) {
                document.getElementById('status').textContent = 'Message saved!';
              } else {
                document.getElementById('status').textContent = 'Failed to save.';
              }
            });
          });
        </script>
      </body>
      </html>
    `);
  } else if (req.url === '/message' && req.method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1].replace(/\+/g, ' ');

      fs.writeFile('message.txt', message, err => {
        if (err) {
          res.writeHead(500);
          return res.end('Error writing file');
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Message saved');
      });
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(5000, () => {
  console.log('Server is running at http://localhost:5000');
});
