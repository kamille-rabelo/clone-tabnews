const { exec } = require("child_process");

function checkPostgresConnection() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgresConnection();
      return;
    }

    process.stdout.write("\n🟢 Postgres is ready and accepting connections!\n");
  }
}

process.stdout.write("\n\n🔴 Waiting for PostgreSQL to accept connections");
checkPostgresConnection();
