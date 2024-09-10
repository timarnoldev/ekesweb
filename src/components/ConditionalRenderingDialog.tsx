import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Editor, useMonaco} from "@monaco-editor/react";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {setConditionalRendering} from "@/lib/utils";
import {Split, X} from "lucide-react";
export function ConditionalRenderingDialog() {

    const defaultRendering = `(creature:Creature):boolean => {
    return true;
}`

    const [program, setProgram] = useState<string>(defaultRendering);
    const [lastError, setLastError] = useState<string | null>(null);

    const language_definition = `
    declare class Creature {
    public readonly energy: number = 200;
    public readonly rotationAngle: number = 0;
    public readonly outMoveForward: number = 0;
    public readonly outRotateRight: number = 0;
    public readonly outRotateLeft: number = 0;
    public readonly outEat: number = 0;
    public readonly childrenCount: number = 0;
    public readonly distanceMoved: number = 0;
    public readonly XPosition: number = 0;
    public readonly YPosition: number = 0;
    public readonly age: number = 0;
    public readonly killed: boolean = false;
    public readonly isRandom: boolean = false;
    public readonly generation: number = 1;
    public readonly invincible: boolean = false;
    }
  
       
    }`

    const monaco = useMonaco();

    useEffect(() => {

        if (monaco) {
            const libUri = "ts:filename/facts.d.ts";
            monaco.languages.typescript.javascriptDefaults.addExtraLib(language_definition, libUri);

            monaco.editor.createModel(language_definition, "typescript", monaco.Uri.parse(libUri));
        }

        const errorEventListener = (e:Event) => {
            setLastError((e as CustomEvent).detail);
        };

        document.addEventListener("conditionalRenderingError", errorEventListener);

        return () => {
            document.removeEventListener("conditionalRenderingError", errorEventListener);
        }
    }, [monaco,language_definition]);

    function handleEditorChange(value: string | undefined) {
        setProgram(value!);
    }

    function save() {
        //get current opened file
        monaco!.editor.getModels().forEach((model) => {
            //get content
            if(model.isAttachedToEditor()) {
                console.log(model.uri.toString());

                monaco!.languages.typescript.getTypeScriptWorker().then(async (worker) => {
                    worker(model.uri).then(async (client) => {
                        const result = await client.getEmitOutput(model.uri.toString());
                        console.log(result.outputFiles[0].text);
                        setConditionalRendering(result.outputFiles[0].text)
                        model.dispose();

                    });
                });
            }

        });

    }

    return <Dialog>
        <DialogTrigger asChild className=""><Button className={"flex flex-row gap-2"}><Split /> Conditional Rendering</Button></DialogTrigger>
        <DialogContent className={"w-1/3"}>
            <DialogHeader>
                <DialogTitle>Conditional Rendering</DialogTitle>
                <DialogDescription>
                    The following function will be evaluated for each actor. If it returns true, the actor will be rendered.
                    In case your code throws an error, the actor will not be rendered.
                </DialogDescription>
            </DialogHeader>
            <DialogBody>
                <Editor className="w-100 h-64"
                        language="typescript"
                        theme="vs-dark"
                        defaultValue={program}
                        options={{
                            //provide language definition for autocompletion

                            minimap: {enabled: false},
                            lineNumbers: "off",
                            wordWrap: "on",
                            wrappingIndent: "same",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            scrollbar: {
                                vertical: 'hidden',
                                horizontal: 'hidden',
                            },

                        }}
                        loading={"Loading..."}
                        onChange={handleEditorChange}



                />
            </DialogBody>

            {lastError != null && <div className="bg-red-100 text-red-900 p-2 rounded-lg flex flex-row justify-between"> {lastError} <X className="cursor-pointer" onClick={()=>setLastError(null)}/></div>}

            <DialogClose ><Button onClick={save}>Apply</Button></DialogClose>
        </DialogContent>
    </Dialog>
}