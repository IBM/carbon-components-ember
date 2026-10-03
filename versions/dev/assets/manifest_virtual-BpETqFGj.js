const load = async () => {
  let request = await fetch('/carbon-components-ember/versions/dev/kolay-manifest/manifest.json', {
    headers: {
      Accept: 'application/json',
    },
  });
  let json = await request.json();
  return json;
};

export { load };
