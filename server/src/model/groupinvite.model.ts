import { Schema, SchemaTypes, Types, model } from "mongoose";

export type InviteStatus = "pending" | "accepted" | "declined" | "expired";

export interface GroupInviteDocument extends Document {
    group_name:String;
	invitedUserId: Types.ObjectId;
	invitedByUserId: Types.ObjectId;
	status: InviteStatus;
	createdAt: Date;
	updatedAt: Date;
}
const GroupInviteSchema = new Schema<GroupInviteDocument>(
	{
        group_name:{
            type:String,
            required:true
        },
		invitedUserId: {
			type: SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		invitedByUserId: {
			type: SchemaTypes.ObjectId,
			reg: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "declined", "expired"],
			default: "pending",
			requried: true,
		},
	},
	{
		timestamps: true,
	}
);
//only one groupinvite active for the user at a time
// groupinviteschema.index(
// 	{ groupid: 1, inviteduserid: 1 },
// 	{ unique: true, partialfilterexpression: { status: "pending" } }
// );

// groupinviteschema.index({ inviteduserid: 1, status: 1 });
// groupinviteschema.index({ groupid: 1, status: 1 });

const groupinvite = model("groupinvite", GroupInviteSchema);
export default groupinvite;
