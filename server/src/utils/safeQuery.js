export async function safeQuery(promise) {
  const { data, error } = await promise;
  if (error) {
    const err = new Error(error.message || 'Database operation failed');
    err.status = error.code === '23505' ? 409 : 500;
    err.code = error.code;
    throw err;
  }
  return data;
}
