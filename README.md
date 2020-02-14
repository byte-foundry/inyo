<p align="center">
  <img src="https://user-images.githubusercontent.com/969003/74459463-a2fafd80-4e8b-11ea-95d3-6053df39789b.png">
</p>

---

<p align="center">
	<strong>Smart Project Manager for freelancers.</strong>
</p>
<p align="center">
	<a href="https://app.netlify.com/sites/inyo-beta/deploys">
		<img alt="Netlify Status" src="https://api.netlify.com/api/v1/badges/0cc8d19a-d817-46f8-ae73-99bc861718f0/deploy-status" />
	</a>
</p>

## Installation & Running

You can use either Yarn or NPM.

```bash
yarn install
yarn start
```

If you want to run your own backend, you need to setup the [Inyo API](https://github.com/byte-foundry/inyo-api) first and configure the following variable:

```bash
export REACT_APP_GRAPHQL_API=http://localhost:3000
```

## Translating

```bash
# Collect all files containing the translation tags
yarn manifest

# Collect translations from the files and generate source
yarn collect-fbts

# Update en-US translation file
yarn generate-locale-file
```
Then, translate all lines marked with `#TODO` in the translation file in the `translations` folder.
```bash
# Generate locale file for the app
yarn translate-fbts
```

## Contributing
Pull requests are welcome. If you find a bug, please check there is not already an issue opened about it.

## License
[AGPLv3](https://github.com/byte-foundry/inyo/blob/release/LICENSE.md)
