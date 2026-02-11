import { relations } from "drizzle-orm/relations";
import { userSubscriptions, subscriptionHistory, stories, ttsRecords, users, storyIllustrations, storyParagraphs } from "./schema";

export const subscriptionHistoryRelations = relations(subscriptionHistory, ({one}) => ({
	userSubscription: one(userSubscriptions, {
		fields: [subscriptionHistory.subscriptionId],
		references: [userSubscriptions.id]
	}),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({one, many}) => ({
	subscriptionHistories: many(subscriptionHistory),
	user: one(users, {
		fields: [userSubscriptions.userId],
		references: [users.userId]
	}),
}));

export const ttsRecordsRelations = relations(ttsRecords, ({one}) => ({
	story: one(stories, {
		fields: [ttsRecords.storyId],
		references: [stories.id]
	}),
}));

export const storiesRelations = relations(stories, ({many}) => ({
	ttsRecords: many(ttsRecords),
	storyIllustrations: many(storyIllustrations),
	storyParagraphs: many(storyParagraphs),
}));

export const usersRelations = relations(users, ({many}) => ({
	userSubscriptions: many(userSubscriptions),
}));

export const storyIllustrationsRelations = relations(storyIllustrations, ({one}) => ({
	story: one(stories, {
		fields: [storyIllustrations.storyId],
		references: [stories.id]
	}),
}));

export const storyParagraphsRelations = relations(storyParagraphs, ({one}) => ({
	story: one(stories, {
		fields: [storyParagraphs.storyId],
		references: [stories.id]
	}),
}));