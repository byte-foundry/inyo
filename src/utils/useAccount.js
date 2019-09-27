import {useEffect, useMemo, useState} from 'react';

import GoogleAccount from './accountSync/googleAccount';

const useAccount = () => {
	const [signedIn, setSignedIn] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [loading, setLoading] = useState(false);
	const googleAccount = useMemo(
		() => GoogleAccount.instance(setSignedIn, setUserInfo, setLoading),
		[setSignedIn, setUserInfo, setLoading],
	);

	useEffect(
		() => () => googleAccount.unsubscribe(setSignedIn, setUserInfo, setLoading),
		[],
	);

	return [googleAccount, signedIn, userInfo, loading];
};

export default useAccount;
