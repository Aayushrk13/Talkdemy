import { useEffect, useState } from "react";
import { Check, X, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUser } from "@/api";

type Invite = {
	_id: string;
	group_name: string;
	invitedByUserId: string;
	invitedUserId: string;
	status: "pending";
};

type GroupInviteDropdownProps = {
	invites: Invite[];
	onAccept: (id: string) => void;
	onReject: (id: string) => void;
};

export default function GroupInviteDropdown({
	invites,
	onAccept,
	onReject,
}: GroupInviteDropdownProps) {
	const [inviterNames,setInviterNames] = useState<Record<string,string>>({});
	useEffect(() => {
		const loadInviters = async () => {
			const missingUserIds = invites
				.map((i) => i.invitedByUserId)
				.filter((id) => !inviterNames[id]);

			if (missingUserIds.length === 0) return;

			const entries = await Promise.all(
				missingUserIds.map(async (id) => {
					const { data } = await getUser(id);
					return [id, data.user_name] as const;
				})
			);

			setInviterNames((prev) => ({
				...prev,
				...Object.fromEntries(entries),
			}));
		};

		loadInviters();
	}, [invites]);

	const [open, setOpen] = useState(false);
	return (
		<div className="relative inline-block">
			<Button
				variant="outline"
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-2"
			>
				<Users size={18} />
				Invites ({invites.length})
			</Button>

			{open && (
				<Card
					className="
            absolute
            left-0
            mt-2
            w-80
            max-w-[calc(100vw-1rem)]
            max-h-96
            overflow-y-auto
            shadow-xl
            rounded-2xl
            z-50
          "
				>
					<CardContent className="p-3 space-y-3">
						{invites.length === 0 ? (
							<p className="text-sm text-gray-500 text-center">
								No pending invites
							</p>
						) : (
							invites.map((invite) => (
								<div
									key={invite._id}
									className="flex items-center justify-between gap-2 border rounded-xl p-2"
								>
									<div className="text-sm min-w-0">
										<p className="font-medium truncate">{invite.group_name}</p>
										<p className="text-xs text-gray-500 truncate">
											Invited by {inviterNames[invite.invitedByUserId] ?? "Loading..."}
										</p>
									</div>

									<div className="flex gap-1 shrink-0">
										<Button
											size="icon"
											className="rounded-full"
											onClick={() => onAccept(invite._id)}
										>
											<Check size={16} />
										</Button>
										<Button
											size="icon"
											variant="destructive"
											className="rounded-full"
											onClick={() => onReject(invite._id)}
										>
											<X size={16} />
										</Button>
									</div>
								</div>
							))
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
