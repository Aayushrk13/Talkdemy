
interface UserSectionProps {
  userName: string;
}

const UserSection: React.FC<UserSectionProps> = ({
  userName,
}) => {
  return (
    <div>
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="flex flex-col">
          <p className="text-gray-900 font-semibold truncate">{userName}</p>
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 border-b">
        <p className="text-sm text-gray-600">
        </p>
      </div>
    </div>
  );
};

export default UserSection;
