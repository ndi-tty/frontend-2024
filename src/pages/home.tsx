import { Button } from "@radix-ui/themes";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/notifications.slice";
import { NotificationType } from "../components/common/notification";

export async function action() {}

export async function loader() {
  const boxesResponse = await fetch("http://localhost:3000/iot");
  const monitorResponse = await fetch("http://localhost:3000/monitor");
  const monitor = await monitorResponse.json();
  const boxes = await boxesResponse.json();
  return { boxes, monitor };
}

export default function Home() {
  const dispatch = useDispatch();

  const handleAddNotification = () => {
    const newNotification = {
      id: new Date().toISOString(),
      message: "This is success test notification",
      type: NotificationType.Success,
    };
    dispatch(addNotification(newNotification));
  };
  return (
    <div>
      <Button onClick={handleAddNotification}>Try Notification</Button>
    </div>
  );
}
