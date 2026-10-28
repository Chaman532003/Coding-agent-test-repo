// The app moves between pages by changing the browser path, and the test window outlives each test.
// Start every test at the landing page.
afterEach(() => {
  window.history.replaceState({}, "", "/");
});
