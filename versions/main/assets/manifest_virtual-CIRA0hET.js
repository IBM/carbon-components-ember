const load = async () => {
  let request = await fetch('/carbon-components-ember/versions/main/kolay-manifest/manifest.json', {
    headers: {
      Accept: 'application/json',
    },
  });
  let json = await request.json();
  return json;
};

export { load };
