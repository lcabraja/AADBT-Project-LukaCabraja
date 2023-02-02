import {
  component$,
  Resource,
  useClientEffect$,
  useResource$,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";

import { pbFactory } from "~/models/pocketbase";
import { type PostRecord, type ExpandedUserRecord } from "~/models/records";
import { type User } from "~/models/user";
import type { Post as PostModel } from "~/models/post";
import styles from "./profile.css?inline";
import { useLocation } from "@builder.io/qwik-city";
import { UserCircle } from "~/components/icons/user";

export default component$(() => {
  useStylesScoped$(styles);
  const location = useLocation();

  const store = useStore<{ user?: User; posts: Post[]; profileError: boolean }>(
    {
      user: undefined,
      posts: [],
      profileError: false,
    }
  );

  const userResource = useResource$<User | undefined>(async () => {
    const pb = pbFactory();
    const userRecord = await pb
      .collection("users")
      .getOne(location.params.userId as string, { expand: "package" });
    console.log(userRecord);
    const eur = userRecord as unknown as ExpandedUserRecord;
    const user = {
      id: eur.id,
      username: eur.username,
      name: eur.name,
      email: eur.email,
      avatar: await pb.getFileUrl(userRecord, userRecord.avatar),
      package: {
        id: eur.expand.package.id,
        package: eur.expand.package.package,
        postsToday: -1,
      },
    };
    store.user = user;
    return user;
  });

  const postsResource = useResource$<Post[] | undefined>(async (ctx) => {
    const pb = pbFactory();
    const posts = (
      await pb.collection("posts").getList(0, 20, {
        filter: `poster = "${location.params.userId}"`,
        sort: "-created",
      })
    ).items;
    return posts.map((post): PostModel => {
      const epr = post as unknown as PostRecord;
      return {
        id: epr.id,
        original: pb.getFileUrl(post, epr.original),
        filtered: pb.getFileUrl(post, epr.filtered),
        description: epr.description,
        hashtags: epr.hashtags,
        poster: epr.poster,
      };
    });
  });

  return (
    <div>
      <div class="profileHeader">
        <Resource
          value={userResource}
          onPending={() => <img src="placeholder" />}
          onResolved={(user) => (
            <div class="avatar">
              {!store.profileError ? (
                <img
                  onError$={() => (store.profileError = true)}
                  src={user!.avatar}
                />
              ) : (
                <UserCircle />
              )}
            </div>
          )}
        />
        <div class="description">
          <div class="stats">
            <Resource
              value={userResource}
              onResolved={(user) => (
                <div>
                  <p>{user?.name}</p>
                  <p>{user?.username}</p>
                </div>
              )}
            />
            <Resource
              value={postsResource}
              onResolved={(posts) => <p>{posts?.length} posts</p>}
            />
          </div>
        </div>
      </div>

      <div key="posts" class="posts">
        <Resource
          value={postsResource}
          onPending={() => <p>Loading...</p>}
          onResolved={(posts) => (
            <>
              {posts && posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <div class="post" key={post.id}>
                      <img src={post.filtered} />
                      <p>{post.hashtags}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div class="placeholderPost"></div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
});
