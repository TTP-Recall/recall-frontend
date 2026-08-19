import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

function SpinnerEmpty() {
  return (
    <Empty className="min-h-[70vh] w-full">
      <EmptyHeader className="gap-4">
        <EmptyMedia variant="icon">
          <Spinner className="size-8" />
        </EmptyMedia>

        <EmptyTitle className="text-2xl font-semibold">
          Processing your request
        </EmptyTitle>

        <EmptyDescription className="text-base">
          Please wait while we process your request.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default SpinnerEmpty;