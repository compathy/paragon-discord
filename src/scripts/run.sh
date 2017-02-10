until node ../para.js; do
    echo "Server 'parashard1' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
