import { AlertDialog, Button, Flex } from "@radix-ui/themes";

interface AlertProps {
  onCancel: () => void;
  onAction: () => void;
  title: string;
  description: string;
  actionText: string;
  cancelText: string;
}

const CustomAlertDialog: React.FC<AlertProps> = (props) => {
  return (
    <AlertDialog.Root defaultOpen={true}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Enable Hardcore Mode?</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Hardcore Mode disables the zoom feature, making the game more
          challenging. Are you up for the challenge?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" onClick={props.onCancel}>
              {props.cancelText}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={props.onAction}>
              {props.actionText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default CustomAlertDialog;
