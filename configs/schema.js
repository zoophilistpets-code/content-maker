import { boolean, integer, json, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull(),
	imageUrl: varchar('imageUrl'),
	subscription: boolean('subscription').default(false),
	credits: integer('credits').default(30) // 30 Credits = 3 videos
})

export const VideoData = pgTable("VideoData", {
	id: serial('id').primaryKey(),
	script: json('script').notNull(),
	audioURL: json('audioURL').notNull(),
	captions: json('captions').notNull(),
	imageList: varchar('imageList').array(),
	hashtags: varchar('hashtags').notNull(),
	sentiment: varchar('sentiment').notNull(),
	score: varchar('score').notNull(),
	reach: varchar('reach').notNull(),
	createdBy: varchar('createdBy').notNull(),
})