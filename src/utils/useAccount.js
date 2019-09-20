import {useEffect, useMemo, useState} from 'react';

import GoogleAccount from './accountSync/googleAccount';

const useAccount = () => {
	const [signedIn, setSignedIn] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const googleAccount = useMemo(
		() => GoogleAccount.instance(setSignedIn, setUserInfo),
		[setSignedIn, setUserInfo],
	);

	useEffect(
		() => () => googleAccount.unsubscribe(setSignedIn, setUserInfo),
		[],
	);

	return [googleAccount, signedIn, userInfo];
};

export default useAccount;
