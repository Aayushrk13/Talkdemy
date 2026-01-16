import { Schema, SchemaTypes, model } from "mongoose";

import { Types } from "mongoose";

interface ClassDoc {
	type: "group" | "direct";
	name?: string;
	members: Types.ObjectId[];
	teacher_id?: Types.ObjectId;
}

const ClassSchema = new Schema(
	{
		type: {
			type: String,
			enum: ["group", "direct"],
			required: true,
		},

		name: {
			type: String,
			required: function (this: ClassDoc) {
				return this.type === "group";
			},
		},

		members: {
			type: [SchemaTypes.ObjectId],
			ref: "User",
		},

		teacher_id: {
			type: SchemaTypes.ObjectId,
			ref: "User",
			required: function (this: ClassDoc) {
				return this.type === "group";
			},
		},

		last_message: {
			content: String,
			sender_id: { type: SchemaTypes.ObjectId, ref: "User" },
			timestamp: Date,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * IMPORTANT:
 * - Members MUST be sorted before saving for direct chats
 * - This index guarantees ONE direct chat per user pair
 */
// ClassSchema.pre("save", function (next) {
//   if (this.type === "direct") {
//     // normalize order so uniqueness works
//     this.members.sort((a, b) =>
//       a.toString().localeCompare(b.toString())
//     );
//   }

//   next();
// });

// ClassSchema.index(
// 	{ type: 1, members: 1 },
// 	{ unique: true, partialFilterExpression: { type: "direct" } }
// );

const Class = model("Class", ClassSchema);

export default Class;
