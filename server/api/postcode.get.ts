export default defineEventHandler(async (event) => {
  const { postcode, number } = getQuery(event);
  const config = useRuntimeConfig();

  // The actual API token should be stored in your .env file
  const apiToken = config.postcodeApiToken;

  if (!postcode || !number) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing postcode or number query parameters',
    });
  }

  if (!apiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API token is not configured',
    });
  }

  try {
    const response = await $fetch<PostcodeApiResponse>('https://postcode.tech/api/v1/postcode', {
      query: {
        postcode,
        number,
      },
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    // Now TypeScript knows the shape of the response
    return {
      street: response.street,
      city: response.city,
    };
  } catch (error) {
    console.error('Error fetching from postcode API:', error);
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch address details from external API',
    });
  }
});
