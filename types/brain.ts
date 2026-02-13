export interface Brain {
	context: string;
	model: string;
	user: string[];
	agent: string[];
	reasoning?: string;
	vectorStoreId?: string;
}


export interface UserBrains {
	[brainName: string]: Brain
}


