export interface Brain {
	context: string;
	user: string;
	agent: string;
	vectorStoreId?: string;
}


export interface UserBrains {
	[brainName: string]: Brain
}


