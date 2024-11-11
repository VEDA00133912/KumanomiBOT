const axios = require('axios');

async function getPackageInfo(packageName) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);

    if (response.status !== 200) {
      throw new Error('not_found');
    }

    const data = response.data;
    const latestVersion = data['dist-tags'].latest;
    const latestData = data.versions[latestVersion];

    return {
      name: data.name,
      version: latestVersion,
      license: latestData.license || '不明',
      author: latestData.author?.name || '不明',
      homepage: latestData.homepage || 'なし',
      repository: latestData.repository?.url || 'なし',
      lastPublish: new Date(data.time[latestVersion]).toLocaleString('ja-JP')
    };
  } catch (error) {
    if (error.message === 'not_found') {
      throw new Error('指定されたパッケージが見つかりませんでした。');
    } else {
      throw new Error('パッケージ情報の取得中にエラーが発生しました。');
    }
  }
}

module.exports = { getPackageInfo };
