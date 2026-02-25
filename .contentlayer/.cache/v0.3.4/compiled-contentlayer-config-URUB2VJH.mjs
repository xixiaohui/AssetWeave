// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import path from "path";
var Devlog = defineDocumentType(() => ({
  name: "Devlog",
  filePathPattern: `*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" }, required: false }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: path.join(process.cwd(), "content/devlog"),
  documentTypes: [Devlog]
});
export {
  Devlog,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-URUB2VJH.mjs.map
