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
import {editor} from "monaco-editor";
import {conditionalRendering, setConditionalRendering, setOnTheFlyModification} from "@/lib/utils";
import {ChartCandlestick, Split, X} from "lucide-react";
export function OnTheFlyModificationDialog() {

    let defaultRendering = `(creature:Creature):void => {
    
}`

    const [program, setProgram] = useState<string>(defaultRendering);
    const [lastError, setLastError] = useState<string | null>(null);

    let language_definition = `
    declare class Creature {
        public energy: number = 200;
    public rotationAngle: number = 0;
    public outMoveForward: number = 0;
    public outRotateRight: number = 0;
    public outRotateLeft: number = 0;
    public outEat: number = 0;
    public childrenCount: number = 0;
    public distanceMoved: number = 0;
    public XPosition: number = 0;
    public YPosition: number = 0;
    public age: number = 0;
    public killed: boolean = false;
    public isRandom: boolean = false;
    public generation: number = 1;
    public invincible: boolean = false;
    }
  
       
    }`

    const monaco = useMonaco();

    useEffect(() => {

        if (monaco) {
            let libUri = "ts:filename/creaturemods.d.ts";
            monaco.languages.typescript.javascriptDefaults.addExtraLib(language_definition, libUri);

            monaco.editor.createModel(language_definition, "typescript", monaco.Uri.parse(libUri));
        }

        let errorEventListener = (e:Event) => {
            setLastError((e as CustomEvent).detail);
        };

        document.addEventListener("OnTheFlyModificationError", errorEventListener);

        return () => {
            document.removeEventListener("OnTheFlyModificationError", errorEventListener);
        }
    }, [monaco]);

    function handleEditorChange(value: string | undefined, ev: editor.IModelContentChangedEvent) {
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
                        let result = await client.getEmitOutput(model.uri.toString());
                        console.log(result.outputFiles[0].text);
                        setOnTheFlyModification(result.outputFiles[0].text)
                        model.dispose();
                    });
                });
            }

        });

    }

    return <Dialog>
        <DialogTrigger asChild  className=""><Button className={"flex flex-row gap-2"}><ChartCandlestick /> OnTheFly Modifications</Button></DialogTrigger>
        <DialogContent className={"w-1/3"}>
            <DialogHeader>
                <DialogTitle>OnTheFly Modification</DialogTitle>
                <DialogDescription>
                    The following function will be evaluated for each actor on a simulation step. You can perform modifications to the actor here.
                    In case your code throws an error, the loop continues without applying the modification.
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