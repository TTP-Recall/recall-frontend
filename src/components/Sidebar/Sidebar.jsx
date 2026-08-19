import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronRight,
  FileText,
  Layers,
  User,
  Plus,
  Folder,
  FolderOpen,
} from "lucide-react";

function AppSidebar({ user, onLogout }) {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/folders", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to fetch folders:", data);
          setFolders([]);
          return;
        }

        setFolders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch folders:", error);
        setFolders([]);
      }
    };

    fetchFolders();
  }, []);

  async function handleNoteCreate() {
    const response = await fetch("http://localhost:8080/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    navigate(`/note/${data.id}/edit`);
  }

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate("/notes")}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500 text-primary-foreground">
                R
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Recall
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  Personal Knowledge Vault
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* New Note */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleNoteCreate}>
                  <Plus />
                  <span>New Note</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Notes */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/notes")}
                >
                  <FileText />
                  <span>Notes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Flashcards */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/note/flashcards")}
                >
                  <Layers />
                  <span>Flashcards</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* All Folders */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/folders")}
                >
                  <FolderOpen />
                  <span>All Folders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Directory */}
              <Collapsible
                defaultOpen
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={<SidebarMenuButton />}
                  >
                    <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    <span>Directory</span>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenu className="ml-4 border-l pl-2">
                      {folders.length > 0 ? (
                        folders.slice(0, 5).map((folder) => (
                          <SidebarMenuItem key={folder.id}>
                            <SidebarMenuButton
                              onClick={() =>
                                navigate(
                                  `/notes/folder/${folder.id}`
                                )
                              }
                            >
                              <Folder />
                              <span>{folder.name}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))
                      ) : (
                        <SidebarMenuItem>
                          <SidebarMenuButton disabled>
                            <span>No folders</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton size="lg" />}
              >
                <div className="flex size-8 items-center justify-center rounded-full border">
                  <User className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || "User"}
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || ""}
                  </span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-64"
              >
                <DropdownMenuGroup>
                  <div className="flex items-center gap-3 p-2">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border">
                      <User className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={onLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;