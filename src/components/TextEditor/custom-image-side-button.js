import {
	ImageSideButton,
	ImageUploadButton,
	addNewBlock,
	getCurrentBlock,
	Block,
} from 'medium-draft';

import {EditorState} from 'draft-js';

export default class CustomImageSideButton extends ImageSideButton {
	/*
    We will only check for first file and also whether
    it is an image or not.
    */
	onChange(e) {
		const file = e.target.files[0];

		if (file.type.indexOf('image/') === 0) {
			const placeHolderBlock = this.createPlaceholderImage(file);
			const placeholderData = placeHolderBlock.getData();
			const placeHolderBlockKey = placeHolderBlock.getKey();
			const formData = new FormData();

			formData.append('data', file);
			// fetch('https://api.graph.cool/file/v1/cjivfsbc585c90108kv0o2i8w', {
			//   method: 'POST',
			//   body: formData,
			// }).then((response) => {
			//   console.log(response)
			//   if (response.status === 200) {
			//     // Assuming server responds with
			//     // `{ "url": "http://example-cdn.com/image.jpg"}`
			//     return response.json().then(data => {
			//     console.log(data)
			//       if (data.url) {
			//         const newData = placeholderData.set('src', data.url);
			//         console.log(newData)
			//         this.props.setEditorState(this.updateDataOfBlock(
			//             this.props.getEditorState(),
			//             placeHolderBlockKey,
			//             newData,
			//         ));
			//       }
			//     });
			//   }
			// });
		}
		this.props.close();
	}

	updateDataOfBlock(editorState, blockKey, newData) {
		console.log(EditorState);
		const contentState = editorState.getCurrentContent();
		const selectionState = editorState.getSelection();
		const newBlock = contentState.getBlockForKey(blockKey).merge({
			data: newData,
		});
		const newContentState = contentState.merge({
			blockMap: contentState.getBlockMap().set(blockKey, newBlock),
			selectionAfter: selectionState,
		});

		return EditorState.push(
			editorState,
			newContentState,
			'change-block-data',
		);
	}

	createPlaceholderImage(file) {
		const src = URL.createObjectURL(file);
		const editorState = addNewBlock(
			this.props.getEditorState(),
			Block.IMAGE,
			{
				src,
			},
		);
		const block = getCurrentBlock(editorState);

		this.props.setEditorState(editorState);
		return block;
	}
}
