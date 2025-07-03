const axios = require('axios');
const cypressTestProjesi = require('./index.js');

describe('Form testleri', () => {
  let result = cypressTestProjesi();
  let hasRepo = false;
  let commits = [];
  beforeAll(async () => {
    if (result.project_url) {
      let parts = result.project_url.split('/');
      if (parts.length) {
        let username = parts[3];
        let repo = parts[4];
        await axios
          .get(
            `https://api.github.com/repos/${username}/${repo}/commits?sha=main&per_page=100&page=1`
          )
          .then((res) => {
            commits = res.data;
            hasRepo = true;
          })
          .catch((err) => (commits = []));
      }
    }
  });

  test("Projenin gitHub adresi index.js'e eklenmiş", () => {
    expect(result.project_url.length).toBeGreaterThan(10);
    expect(typeof result).toBe('object');
    expect(Array.isArray(result)).not.toBe(true); // Nesne olmalı, Array değil
  });

  test('Projenin gitHub adresi public olarak erişilebiliyor.', () => {
    expect(hasRepo).toBe(true);
  });

  test('Projeye en az 4 commit atılmış.', () => {
    expect(commits.length).toBeGreaterThan(3);
  });
});
