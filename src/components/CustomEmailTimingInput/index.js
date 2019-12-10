import React from "react";

import fbt from "../../fbt/fbt.macro";
import TimingInput from "../TimingInput";

const CustomEmailTimingInput = () => {
	return (
		<div style={{ display: "flex", alignItems: "center" }}>
			<fbt desc="email timing intro">Cet email est envoyé</fbt>{" "}
			<TimingInput />
		</div>
	);
};

export default CustomEmailTimingInput;
