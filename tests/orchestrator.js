import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      onRetry: (error, attempt) => {
        console.error(
          `Attempt ${attempt} - Failed to fetch status page: ${error.message}`,
        );
      },
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/status");

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
      } catch (error) {
        throw error;
      }
    }
  }
}

export default {
  waitForAllServices,
};
