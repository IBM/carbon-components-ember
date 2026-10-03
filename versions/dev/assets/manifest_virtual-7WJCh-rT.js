const e=async()=>{let e=await fetch("/carbon-components-ember/versions/dev/kolay-manifest/manifest.json",{headers:{Accept:"application/json"}});return await e.json()};export{e as load};
