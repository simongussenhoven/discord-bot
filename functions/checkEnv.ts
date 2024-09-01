export const checkEnv = () => {
  if (!process.env.TOKEN) {
    console.error("Error: TOKEN is not set in the environment variables.");
    process.exit(1);
  }
  if (!process.env.SSH_PASS) {
    console.error("Error: SSH_PASS is not set in the environment variables.");
    process.exit(1);
  }
}