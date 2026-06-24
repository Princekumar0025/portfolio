import subprocess
try:
    result = subprocess.run(['python', 'app.py'], capture_output=True, text=True, timeout=4)
    with open('compile_log.txt', 'w') as f:
        f.write("STDOUT:\n")
        f.write(result.stdout)
        f.write("STDERR:\n")
        f.write(result.stderr)
except subprocess.TimeoutExpired as e:
    with open('compile_log.txt', 'w') as f:
        f.write("Timeout Error - Server kept running (meaning NO boot errors)!\n")
        if e.stdout: f.write(e.stdout.decode())
        if e.stderr: f.write(e.stderr.decode())
