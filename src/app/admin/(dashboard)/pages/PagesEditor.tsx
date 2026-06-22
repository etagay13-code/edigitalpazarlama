"use client";

import { InlineEditor, type EditorItem } from "@/components/admin/InlineEditor";
import { SectionBodyEditor } from "@/components/admin/SectionBodyEditor";
import { create, update, remove } from "./actions";
import { fields } from "./config";

export function PagesEditor({ items }: { items: EditorItem[] }) {
  return (
    <InlineEditor
      items={items}
      fields={fields}
      actions={{ create, update, remove }}
      newItemDefaults={{ page_slug: "about", section_key: "", sort_order: 0 }}
      customFieldRender={(field, item) => {
        if (field.name === "body") {
          return (
            <SectionBodyEditor
              name="body"
              pageSlug={
                typeof item.page_slug === "string" ? item.page_slug : null
              }
              sectionKey={
                typeof item.section_key === "string" ? item.section_key : null
              }
              initialBody={item.body}
            />
          );
        }
        return null;
      }}
    />
  );
}
