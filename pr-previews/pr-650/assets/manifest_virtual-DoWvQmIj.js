const load = async () => {
  let request = await fetch('/carbon-components-ember/pr-previews/pr-650/kolay-manifest/manifest.json', {
    headers: {
      Accept: 'application/json',
    },
  });
  let json = await request.json();
  return json;
};

export { load };
