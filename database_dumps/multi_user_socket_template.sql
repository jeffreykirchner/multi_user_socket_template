PGDMP          	            |           multi_user_socket_template     13.7 (Ubuntu 13.7-1.pgdg20.04+1)     16.3 (Ubuntu 16.3-1.pgdg20.04+1) $   G           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            H           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            I           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            J           1262    37500    multi_user_socket_template    DATABASE     �   CREATE DATABASE multi_user_socket_template WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
 *   DROP DATABASE multi_user_socket_template;
             
   dbadmin_su    false            K           0    0 #   DATABASE multi_user_socket_template    ACL     =   GRANT ALL ON DATABASE multi_user_socket_template TO dbadmin;
                
   dbadmin_su    false    3402                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            L           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    5            �            1259    37501 
   auth_group    TABLE     f   CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);
    DROP TABLE public.auth_group;
       public         heap    dbadmin    false    5            �            1259    37504    auth_group_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.auth_group_id_seq;
       public          dbadmin    false    200    5            M           0    0    auth_group_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;
          public          dbadmin    false    201            �            1259    37506    auth_group_permissions    TABLE     �   CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);
 *   DROP TABLE public.auth_group_permissions;
       public         heap    dbadmin    false    5            �            1259    37509    auth_group_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.auth_group_permissions_id_seq;
       public          dbadmin    false    202    5            N           0    0    auth_group_permissions_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;
          public          dbadmin    false    203            �            1259    37511    auth_permission    TABLE     �   CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);
 #   DROP TABLE public.auth_permission;
       public         heap    dbadmin    false    5            �            1259    37514    auth_permission_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.auth_permission_id_seq;
       public          dbadmin    false    204    5            O           0    0    auth_permission_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;
          public          dbadmin    false    205            �            1259    37516 	   auth_user    TABLE     �  CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);
    DROP TABLE public.auth_user;
       public         heap    dbadmin    false    5            �            1259    37522    auth_user_groups    TABLE        CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);
 $   DROP TABLE public.auth_user_groups;
       public         heap    dbadmin    false    5            �            1259    37525    auth_user_groups_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_user_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.auth_user_groups_id_seq;
       public          dbadmin    false    5    207            P           0    0    auth_user_groups_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;
          public          dbadmin    false    208            �            1259    37527    auth_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.auth_user_id_seq;
       public          dbadmin    false    206    5            Q           0    0    auth_user_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;
          public          dbadmin    false    209            �            1259    37529    auth_user_user_permissions    TABLE     �   CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);
 .   DROP TABLE public.auth_user_user_permissions;
       public         heap    dbadmin    false    5            �            1259    37532 !   auth_user_user_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.auth_user_user_permissions_id_seq;
       public          dbadmin    false    210    5            R           0    0 !   auth_user_user_permissions_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;
          public          dbadmin    false    211            �            1259    37534    django_admin_log    TABLE     �  CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);
 $   DROP TABLE public.django_admin_log;
       public         heap    dbadmin    false    5            �            1259    37541    django_admin_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.django_admin_log_id_seq;
       public          dbadmin    false    212    5            S           0    0    django_admin_log_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;
          public          dbadmin    false    213            �            1259    37543    django_content_type    TABLE     �   CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);
 '   DROP TABLE public.django_content_type;
       public         heap    dbadmin    false    5            �            1259    37546    django_content_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.django_content_type_id_seq;
       public          dbadmin    false    214    5            T           0    0    django_content_type_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;
          public          dbadmin    false    215            �            1259    37548    django_migrations    TABLE     �   CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);
 %   DROP TABLE public.django_migrations;
       public         heap    dbadmin    false    5            �            1259    37554    django_migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.django_migrations_id_seq;
       public          dbadmin    false    5    216            U           0    0    django_migrations_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;
          public          dbadmin    false    217            �            1259    37556    django_session    TABLE     �   CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);
 "   DROP TABLE public.django_session;
       public         heap    dbadmin    false    5            �            1259    37562    main_helpdocs    TABLE     �   CREATE TABLE public.main_helpdocs (
    id bigint NOT NULL,
    title character varying(300) NOT NULL,
    text text NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);
 !   DROP TABLE public.main_helpdocs;
       public         heap    dbadmin    false    5            �            1259    37568    main_helpdocs_id_seq    SEQUENCE     }   CREATE SEQUENCE public.main_helpdocs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.main_helpdocs_id_seq;
       public          dbadmin    false    219    5            V           0    0    main_helpdocs_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.main_helpdocs_id_seq OWNED BY public.main_helpdocs.id;
          public          dbadmin    false    220                        1259    552126    main_helpdocssubject    TABLE       CREATE TABLE public.main_helpdocssubject (
    id bigint NOT NULL,
    title character varying(300) NOT NULL,
    text text NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    instruction_set_id bigint NOT NULL
);
 (   DROP TABLE public.main_helpdocssubject;
       public         heap    dbadmin    false    5            �            1259    552124    main_helpdocssubject_id_seq    SEQUENCE     �   ALTER TABLE public.main_helpdocssubject ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_helpdocssubject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    256    5            �            1259    37570    main_instruction    TABLE     
  CREATE TABLE public.main_instruction (
    id bigint NOT NULL,
    text_html text NOT NULL,
    page_number integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    instruction_set_id bigint NOT NULL
);
 $   DROP TABLE public.main_instruction;
       public         heap    dbadmin    false    5            �            1259    37576    main_instruction_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_instruction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.main_instruction_id_seq;
       public          dbadmin    false    5    221            W           0    0    main_instruction_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.main_instruction_id_seq OWNED BY public.main_instruction.id;
          public          dbadmin    false    222            �            1259    37578    main_instructionset    TABLE     �  CREATE TABLE public.main_instructionset (
    id bigint NOT NULL,
    label character varying(100) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    action_page_1 integer NOT NULL,
    action_page_2 integer NOT NULL,
    action_page_3 integer NOT NULL,
    action_page_4 integer NOT NULL,
    action_page_5 integer NOT NULL,
    action_page_6 integer NOT NULL
);
 '   DROP TABLE public.main_instructionset;
       public         heap    dbadmin    false    5            �            1259    37581    main_instructionset_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_instructionset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.main_instructionset_id_seq;
       public          dbadmin    false    5    223            X           0    0    main_instructionset_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.main_instructionset_id_seq OWNED BY public.main_instructionset.id;
          public          dbadmin    false    224            �            1259    37583    main_parameters    TABLE     �  CREATE TABLE public.main_parameters (
    id bigint NOT NULL,
    contact_email character varying(1000) NOT NULL,
    experiment_time_zone character varying(1000) NOT NULL,
    site_url character varying(200) NOT NULL,
    invitation_text text NOT NULL,
    invitation_subject character varying(200) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);
 #   DROP TABLE public.main_parameters;
       public         heap    dbadmin    false    5            �            1259    37589    main_parameters_id_seq    SEQUENCE        CREATE SEQUENCE public.main_parameters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.main_parameters_id_seq;
       public          dbadmin    false    5    225            Y           0    0    main_parameters_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.main_parameters_id_seq OWNED BY public.main_parameters.id;
          public          dbadmin    false    226            �            1259    37591    main_parameterset    TABLE     
  CREATE TABLE public.main_parameterset (
    id bigint NOT NULL,
    period_count integer NOT NULL,
    period_length integer NOT NULL,
    show_instructions boolean NOT NULL,
    test_mode boolean NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    survey_link character varying(1000),
    survey_required boolean NOT NULL,
    json_for_session jsonb,
    prolific_mode boolean NOT NULL,
    prolific_completion_link character varying(1000),
    reconnection_limit integer NOT NULL,
    tokens_per_period integer NOT NULL,
    world_height integer NOT NULL,
    world_width integer NOT NULL,
    cool_down_length integer NOT NULL,
    interaction_length integer NOT NULL,
    interaction_range integer NOT NULL,
    avatar_animation_speed numeric(3,2) NOT NULL,
    avatar_bound_box_percent numeric(3,2) NOT NULL,
    avatar_move_speed numeric(3,1) NOT NULL,
    avatar_scale numeric(3,2) NOT NULL,
    break_frequency integer NOT NULL,
    break_length integer NOT NULL
);
 %   DROP TABLE public.main_parameterset;
       public         heap    dbadmin    false    5            �            1259    37594    main_parameterset_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_parameterset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.main_parameterset_id_seq;
       public          dbadmin    false    227    5            Z           0    0    main_parameterset_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.main_parameterset_id_seq OWNED BY public.main_parameterset.id;
          public          dbadmin    false    228            �            1259    537700    main_parametersetbarrier    TABLE     �  CREATE TABLE public.main_parametersetbarrier (
    id bigint NOT NULL,
    info character varying(100),
    start_x integer NOT NULL,
    start_y integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    text character varying(100) NOT NULL,
    rotation integer NOT NULL,
    period_on integer NOT NULL,
    period_off integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    parameter_set_id bigint NOT NULL
);
 ,   DROP TABLE public.main_parametersetbarrier;
       public         heap    dbadmin    false    5            �            1259    537698    main_parametersetbarrier_id_seq    SEQUENCE     �   ALTER TABLE public.main_parametersetbarrier ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_parametersetbarrier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    250    5            �            1259    537707 -   main_parametersetbarrier_parameter_set_groups    TABLE     �   CREATE TABLE public.main_parametersetbarrier_parameter_set_groups (
    id integer NOT NULL,
    parametersetbarrier_id bigint NOT NULL,
    parametersetgroup_id bigint NOT NULL
);
 A   DROP TABLE public.main_parametersetbarrier_parameter_set_groups;
       public         heap    dbadmin    false    5            �            1259    537705 4   main_parametersetbarrier_parameter_set_groups_id_seq    SEQUENCE       ALTER TABLE public.main_parametersetbarrier_parameter_set_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_parametersetbarrier_parameter_set_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    252    5                       1259    560476 .   main_parametersetbarrier_parameter_set_players    TABLE     �   CREATE TABLE public.main_parametersetbarrier_parameter_set_players (
    id integer NOT NULL,
    parametersetbarrier_id bigint NOT NULL,
    parametersetplayer_id bigint NOT NULL
);
 B   DROP TABLE public.main_parametersetbarrier_parameter_set_players;
       public         heap    dbadmin    false    5                       1259    560474 5   main_parametersetbarrier_parameter_set_players_id_seq    SEQUENCE       ALTER TABLE public.main_parametersetbarrier_parameter_set_players ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_parametersetbarrier_parameter_set_players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    5    258            �            1259    552073    main_parametersetground    TABLE     �  CREATE TABLE public.main_parametersetground (
    id bigint NOT NULL,
    info character varying(100),
    x integer NOT NULL,
    y integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    tint character varying(8) NOT NULL,
    texture character varying NOT NULL,
    rotation numeric(3,2) NOT NULL,
    scale numeric(3,2) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    parameter_set_id bigint NOT NULL
);
 +   DROP TABLE public.main_parametersetground;
       public         heap    dbadmin    false    5            �            1259    552071    main_parametersetground_id_seq    SEQUENCE     �   ALTER TABLE public.main_parametersetground ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_parametersetground_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    254    5            �            1259    537681    main_parametersetgroup    TABLE     �   CREATE TABLE public.main_parametersetgroup (
    id bigint NOT NULL,
    name character varying(255),
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    parameter_set_id bigint NOT NULL
);
 *   DROP TABLE public.main_parametersetgroup;
       public         heap    dbadmin    false    5            �            1259    537679    main_parametersetgroup_id_seq    SEQUENCE     �   ALTER TABLE public.main_parametersetgroup ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_parametersetgroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    5    248            �            1259    537021    main_parametersetnotice    TABLE     u  CREATE TABLE public.main_parametersetnotice (
    id bigint NOT NULL,
    text character varying(200),
    start_period integer NOT NULL,
    start_time integer NOT NULL,
    end_period integer NOT NULL,
    end_time integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    parameter_set_id bigint NOT NULL
);
 +   DROP TABLE public.main_parametersetnotice;
       public         heap    dbadmin    false    5            �            1259    537019    main_parametersetnotice_id_seq    SEQUENCE     �   ALTER TABLE public.main_parametersetnotice ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_parametersetnotice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    244    5            �            1259    37596    main_parametersetplayer    TABLE     �  CREATE TABLE public.main_parametersetplayer (
    id bigint NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    parameter_set_id bigint NOT NULL,
    id_label character varying(2) NOT NULL,
    player_number integer NOT NULL,
    hex_color character varying(30) NOT NULL,
    start_x integer NOT NULL,
    start_y integer NOT NULL,
    parameter_set_group_id bigint,
    instruction_set_id bigint
);
 +   DROP TABLE public.main_parametersetplayer;
       public         heap    dbadmin    false    5            �            1259    37599    main_parametersetplayer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_parametersetplayer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.main_parametersetplayer_id_seq;
       public          dbadmin    false    229    5            [           0    0    main_parametersetplayer_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.main_parametersetplayer_id_seq OWNED BY public.main_parametersetplayer.id;
          public          dbadmin    false    230            �            1259    537394    main_parametersetwall    TABLE     d  CREATE TABLE public.main_parametersetwall (
    id bigint NOT NULL,
    info character varying(100),
    start_x integer NOT NULL,
    start_y integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    parameter_set_id bigint NOT NULL
);
 )   DROP TABLE public.main_parametersetwall;
       public         heap    dbadmin    false    5            �            1259    537392    main_parametersetwall_id_seq    SEQUENCE     �   ALTER TABLE public.main_parametersetwall ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_parametersetwall_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    246    5                       1259    676904    main_profileloginattempt    TABLE     �   CREATE TABLE public.main_profileloginattempt (
    id bigint NOT NULL,
    success boolean NOT NULL,
    note text,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);
 ,   DROP TABLE public.main_profileloginattempt;
       public         heap    dbadmin    false    5                       1259    676902    main_profileloginattempt_id_seq    SEQUENCE     �   ALTER TABLE public.main_profileloginattempt ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_profileloginattempt_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    260    5            �            1259    37601    main_session    TABLE     �  CREATE TABLE public.main_session (
    id bigint NOT NULL,
    title character varying(300) NOT NULL,
    start_date date NOT NULL,
    channel_key uuid NOT NULL,
    session_key uuid NOT NULL,
    started boolean NOT NULL,
    shared boolean NOT NULL,
    locked boolean NOT NULL,
    invitation_text text NOT NULL,
    invitation_subject text NOT NULL,
    soft_delete boolean NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    creator_id integer NOT NULL,
    parameter_set_id bigint NOT NULL,
    world_state jsonb,
    controlling_channel character varying(300) NOT NULL,
    id_string character varying(6)
);
     DROP TABLE public.main_session;
       public         heap    dbadmin    false    5            �            1259    37607    main_session_collaborators    TABLE     �   CREATE TABLE public.main_session_collaborators (
    id integer NOT NULL,
    session_id bigint NOT NULL,
    user_id integer NOT NULL
);
 .   DROP TABLE public.main_session_collaborators;
       public         heap    dbadmin    false    5            �            1259    37610 !   main_session_collaborators_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_session_collaborators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.main_session_collaborators_id_seq;
       public          dbadmin    false    232    5            \           0    0 !   main_session_collaborators_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.main_session_collaborators_id_seq OWNED BY public.main_session_collaborators.id;
          public          dbadmin    false    233            �            1259    37612    main_session_id_seq    SEQUENCE     |   CREATE SEQUENCE public.main_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.main_session_id_seq;
       public          dbadmin    false    5    231            ]           0    0    main_session_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.main_session_id_seq OWNED BY public.main_session.id;
          public          dbadmin    false    234            �            1259    403161    main_sessionevent    TABLE     e  CREATE TABLE public.main_sessionevent (
    id bigint NOT NULL,
    period_number integer NOT NULL,
    time_remaining integer NOT NULL,
    type character varying(255) NOT NULL,
    data jsonb,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    session_id bigint NOT NULL,
    session_player_id bigint
);
 %   DROP TABLE public.main_sessionevent;
       public         heap    dbadmin    false    5            �            1259    403159    main_sessionevent_id_seq    SEQUENCE     �   ALTER TABLE public.main_sessionevent ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.main_sessionevent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          dbadmin    false    242    5            �            1259    37614    main_sessionperiod    TABLE       CREATE TABLE public.main_sessionperiod (
    id bigint NOT NULL,
    period_number integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    session_id bigint NOT NULL,
    summary_data jsonb
);
 &   DROP TABLE public.main_sessionperiod;
       public         heap    dbadmin    false    5            �            1259    37617    main_sessionperiod_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_sessionperiod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.main_sessionperiod_id_seq;
       public          dbadmin    false    5    235            ^           0    0    main_sessionperiod_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.main_sessionperiod_id_seq OWNED BY public.main_sessionperiod.id;
          public          dbadmin    false    236            �            1259    37619    main_sessionplayer    TABLE     �  CREATE TABLE public.main_sessionplayer (
    id bigint NOT NULL,
    player_number integer NOT NULL,
    player_key uuid NOT NULL,
    connecting boolean NOT NULL,
    connected_count integer NOT NULL,
    name character varying(100),
    student_id character varying(100),
    email character varying(100),
    earnings integer NOT NULL,
    current_instruction integer NOT NULL,
    current_instruction_complete integer NOT NULL,
    instructions_finished boolean NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    parameter_set_player_id bigint NOT NULL,
    session_id bigint NOT NULL,
    name_submitted boolean NOT NULL,
    survey_complete boolean NOT NULL
);
 &   DROP TABLE public.main_sessionplayer;
       public         heap    dbadmin    false    5            �            1259    37622    main_sessionplayer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_sessionplayer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.main_sessionplayer_id_seq;
       public          dbadmin    false    5    237            _           0    0    main_sessionplayer_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.main_sessionplayer_id_seq OWNED BY public.main_sessionplayer.id;
          public          dbadmin    false    238            �            1259    37638    main_sessionplayerperiod    TABLE       CREATE TABLE public.main_sessionplayerperiod (
    id bigint NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    session_period_id bigint NOT NULL,
    session_player_id bigint NOT NULL,
    earnings integer NOT NULL
);
 ,   DROP TABLE public.main_sessionplayerperiod;
       public         heap    dbadmin    false    5            �            1259    37641    main_sessionplayerperiod_id_seq    SEQUENCE     �   CREATE SEQUENCE public.main_sessionplayerperiod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.main_sessionplayerperiod_id_seq;
       public          dbadmin    false    5    239            `           0    0    main_sessionplayerperiod_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.main_sessionplayerperiod_id_seq OWNED BY public.main_sessionplayerperiod.id;
          public          dbadmin    false    240            �           2604    37643    auth_group id    DEFAULT     n   ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);
 <   ALTER TABLE public.auth_group ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    201    200            �           2604    37644    auth_group_permissions id    DEFAULT     �   ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);
 H   ALTER TABLE public.auth_group_permissions ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    203    202            �           2604    37645    auth_permission id    DEFAULT     x   ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);
 A   ALTER TABLE public.auth_permission ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    205    204            �           2604    37646    auth_user id    DEFAULT     l   ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);
 ;   ALTER TABLE public.auth_user ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    209    206            �           2604    37647    auth_user_groups id    DEFAULT     z   ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);
 B   ALTER TABLE public.auth_user_groups ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    208    207            �           2604    37648    auth_user_user_permissions id    DEFAULT     �   ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);
 L   ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    211    210            �           2604    37649    django_admin_log id    DEFAULT     z   ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);
 B   ALTER TABLE public.django_admin_log ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    213    212            �           2604    37650    django_content_type id    DEFAULT     �   ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);
 E   ALTER TABLE public.django_content_type ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    215    214            �           2604    37651    django_migrations id    DEFAULT     |   ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);
 C   ALTER TABLE public.django_migrations ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    217    216            �           2604    37652    main_helpdocs id    DEFAULT     t   ALTER TABLE ONLY public.main_helpdocs ALTER COLUMN id SET DEFAULT nextval('public.main_helpdocs_id_seq'::regclass);
 ?   ALTER TABLE public.main_helpdocs ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    220    219            �           2604    37653    main_instruction id    DEFAULT     z   ALTER TABLE ONLY public.main_instruction ALTER COLUMN id SET DEFAULT nextval('public.main_instruction_id_seq'::regclass);
 B   ALTER TABLE public.main_instruction ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    222    221            �           2604    37654    main_instructionset id    DEFAULT     �   ALTER TABLE ONLY public.main_instructionset ALTER COLUMN id SET DEFAULT nextval('public.main_instructionset_id_seq'::regclass);
 E   ALTER TABLE public.main_instructionset ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    224    223            �           2604    37655    main_parameters id    DEFAULT     x   ALTER TABLE ONLY public.main_parameters ALTER COLUMN id SET DEFAULT nextval('public.main_parameters_id_seq'::regclass);
 A   ALTER TABLE public.main_parameters ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    226    225            �           2604    37656    main_parameterset id    DEFAULT     |   ALTER TABLE ONLY public.main_parameterset ALTER COLUMN id SET DEFAULT nextval('public.main_parameterset_id_seq'::regclass);
 C   ALTER TABLE public.main_parameterset ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    228    227            �           2604    37657    main_parametersetplayer id    DEFAULT     �   ALTER TABLE ONLY public.main_parametersetplayer ALTER COLUMN id SET DEFAULT nextval('public.main_parametersetplayer_id_seq'::regclass);
 I   ALTER TABLE public.main_parametersetplayer ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    230    229            �           2604    37658    main_session id    DEFAULT     r   ALTER TABLE ONLY public.main_session ALTER COLUMN id SET DEFAULT nextval('public.main_session_id_seq'::regclass);
 >   ALTER TABLE public.main_session ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    234    231            �           2604    37659    main_session_collaborators id    DEFAULT     �   ALTER TABLE ONLY public.main_session_collaborators ALTER COLUMN id SET DEFAULT nextval('public.main_session_collaborators_id_seq'::regclass);
 L   ALTER TABLE public.main_session_collaborators ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    233    232            �           2604    37660    main_sessionperiod id    DEFAULT     ~   ALTER TABLE ONLY public.main_sessionperiod ALTER COLUMN id SET DEFAULT nextval('public.main_sessionperiod_id_seq'::regclass);
 D   ALTER TABLE public.main_sessionperiod ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    236    235            �           2604    37661    main_sessionplayer id    DEFAULT     ~   ALTER TABLE ONLY public.main_sessionplayer ALTER COLUMN id SET DEFAULT nextval('public.main_sessionplayer_id_seq'::regclass);
 D   ALTER TABLE public.main_sessionplayer ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    238    237            �           2604    37664    main_sessionplayerperiod id    DEFAULT     �   ALTER TABLE ONLY public.main_sessionplayerperiod ALTER COLUMN id SET DEFAULT nextval('public.main_sessionplayerperiod_id_seq'::regclass);
 J   ALTER TABLE public.main_sessionplayerperiod ALTER COLUMN id DROP DEFAULT;
       public          dbadmin    false    240    239                      0    37501 
   auth_group 
   TABLE DATA           .   COPY public.auth_group (id, name) FROM stdin;
    public          dbadmin    false    200   D�      
          0    37506    auth_group_permissions 
   TABLE DATA           M   COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
    public          dbadmin    false    202   a�                0    37511    auth_permission 
   TABLE DATA           N   COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
    public          dbadmin    false    204   ~�                0    37516 	   auth_user 
   TABLE DATA           �   COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
    public          dbadmin    false    206   ��                0    37522    auth_user_groups 
   TABLE DATA           A   COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
    public          dbadmin    false    207   ��                0    37529    auth_user_user_permissions 
   TABLE DATA           P   COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
    public          dbadmin    false    210   ��                0    37534    django_admin_log 
   TABLE DATA           �   COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
    public          dbadmin    false    212   ˵                0    37543    django_content_type 
   TABLE DATA           C   COPY public.django_content_type (id, app_label, model) FROM stdin;
    public          dbadmin    false    214   ��                0    37548    django_migrations 
   TABLE DATA           C   COPY public.django_migrations (id, app, name, applied) FROM stdin;
    public          dbadmin    false    216   ��                0    37556    django_session 
   TABLE DATA           P   COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
    public          dbadmin    false    218   ��                0    37562    main_helpdocs 
   TABLE DATA           N   COPY public.main_helpdocs (id, title, text, "timestamp", updated) FROM stdin;
    public          dbadmin    false    219   ��      @          0    552126    main_helpdocssubject 
   TABLE DATA           i   COPY public.main_helpdocssubject (id, title, text, "timestamp", updated, instruction_set_id) FROM stdin;
    public          dbadmin    false    256   �                0    37570    main_instruction 
   TABLE DATA           p   COPY public.main_instruction (id, text_html, page_number, "timestamp", updated, instruction_set_id) FROM stdin;
    public          dbadmin    false    221   ��                0    37578    main_instructionset 
   TABLE DATA           �   COPY public.main_instructionset (id, label, "timestamp", updated, action_page_1, action_page_2, action_page_3, action_page_4, action_page_5, action_page_6) FROM stdin;
    public          dbadmin    false    223   \�      !          0    37583    main_parameters 
   TABLE DATA           �   COPY public.main_parameters (id, contact_email, experiment_time_zone, site_url, invitation_text, invitation_subject, "timestamp", updated) FROM stdin;
    public          dbadmin    false    225   ��      #          0    37591    main_parameterset 
   TABLE DATA           �  COPY public.main_parameterset (id, period_count, period_length, show_instructions, test_mode, "timestamp", updated, survey_link, survey_required, json_for_session, prolific_mode, prolific_completion_link, reconnection_limit, tokens_per_period, world_height, world_width, cool_down_length, interaction_length, interaction_range, avatar_animation_speed, avatar_bound_box_percent, avatar_move_speed, avatar_scale, break_frequency, break_length) FROM stdin;
    public          dbadmin    false    227   �      :          0    537700    main_parametersetbarrier 
   TABLE DATA           �   COPY public.main_parametersetbarrier (id, info, start_x, start_y, width, height, text, rotation, period_on, period_off, "timestamp", updated, parameter_set_id) FROM stdin;
    public          dbadmin    false    250   6�      <          0    537707 -   main_parametersetbarrier_parameter_set_groups 
   TABLE DATA           y   COPY public.main_parametersetbarrier_parameter_set_groups (id, parametersetbarrier_id, parametersetgroup_id) FROM stdin;
    public          dbadmin    false    252   ��      B          0    560476 .   main_parametersetbarrier_parameter_set_players 
   TABLE DATA           {   COPY public.main_parametersetbarrier_parameter_set_players (id, parametersetbarrier_id, parametersetplayer_id) FROM stdin;
    public          dbadmin    false    258   ��      >          0    552073    main_parametersetground 
   TABLE DATA           �   COPY public.main_parametersetground (id, info, x, y, width, height, tint, texture, rotation, scale, "timestamp", updated, parameter_set_id) FROM stdin;
    public          dbadmin    false    254   �      8          0    537681    main_parametersetgroup 
   TABLE DATA           b   COPY public.main_parametersetgroup (id, name, "timestamp", updated, parameter_set_id) FROM stdin;
    public          dbadmin    false    248   ��      4          0    537021    main_parametersetnotice 
   TABLE DATA           �   COPY public.main_parametersetnotice (id, text, start_period, start_time, end_period, end_time, "timestamp", updated, parameter_set_id) FROM stdin;
    public          dbadmin    false    244   ��      %          0    37596    main_parametersetplayer 
   TABLE DATA           �   COPY public.main_parametersetplayer (id, "timestamp", updated, parameter_set_id, id_label, player_number, hex_color, start_x, start_y, parameter_set_group_id, instruction_set_id) FROM stdin;
    public          dbadmin    false    229   �      6          0    537394    main_parametersetwall 
   TABLE DATA           �   COPY public.main_parametersetwall (id, info, start_x, start_y, width, height, "timestamp", updated, parameter_set_id) FROM stdin;
    public          dbadmin    false    246   6�      D          0    676904    main_profileloginattempt 
   TABLE DATA           d   COPY public.main_profileloginattempt (id, success, note, "timestamp", updated, user_id) FROM stdin;
    public          dbadmin    false    260   ��      '          0    37601    main_session 
   TABLE DATA             COPY public.main_session (id, title, start_date, channel_key, session_key, started, shared, locked, invitation_text, invitation_subject, soft_delete, "timestamp", updated, creator_id, parameter_set_id, world_state, controlling_channel, id_string) FROM stdin;
    public          dbadmin    false    231   ��      (          0    37607    main_session_collaborators 
   TABLE DATA           M   COPY public.main_session_collaborators (id, session_id, user_id) FROM stdin;
    public          dbadmin    false    232         2          0    403161    main_sessionevent 
   TABLE DATA           �   COPY public.main_sessionevent (id, period_number, time_remaining, type, data, "timestamp", updated, session_id, session_player_id) FROM stdin;
    public          dbadmin    false    242   �      +          0    37614    main_sessionperiod 
   TABLE DATA           o   COPY public.main_sessionperiod (id, period_number, "timestamp", updated, session_id, summary_data) FROM stdin;
    public          dbadmin    false    235    '      -          0    37619    main_sessionplayer 
   TABLE DATA           1  COPY public.main_sessionplayer (id, player_number, player_key, connecting, connected_count, name, student_id, email, earnings, current_instruction, current_instruction_complete, instructions_finished, "timestamp", updated, parameter_set_player_id, session_id, name_submitted, survey_complete) FROM stdin;
    public          dbadmin    false    237   *      /          0    37638    main_sessionplayerperiod 
   TABLE DATA           |   COPY public.main_sessionplayerperiod (id, "timestamp", updated, session_period_id, session_player_id, earnings) FROM stdin;
    public          dbadmin    false    239   �2      a           0    0    auth_group_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);
          public          dbadmin    false    201            b           0    0    auth_group_permissions_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);
          public          dbadmin    false    203            c           0    0    auth_permission_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.auth_permission_id_seq', 104, true);
          public          dbadmin    false    205            d           0    0    auth_user_groups_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);
          public          dbadmin    false    208            e           0    0    auth_user_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.auth_user_id_seq', 1, true);
          public          dbadmin    false    209            f           0    0 !   auth_user_user_permissions_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);
          public          dbadmin    false    211            g           0    0    django_admin_log_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.django_admin_log_id_seq', 43, true);
          public          dbadmin    false    213            h           0    0    django_content_type_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.django_content_type_id_seq', 26, true);
          public          dbadmin    false    215            i           0    0    django_migrations_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.django_migrations_id_seq', 74, true);
          public          dbadmin    false    217            j           0    0    main_helpdocs_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.main_helpdocs_id_seq', 1, true);
          public          dbadmin    false    220            k           0    0    main_helpdocssubject_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.main_helpdocssubject_id_seq', 3, true);
          public          dbadmin    false    255            l           0    0    main_instruction_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.main_instruction_id_seq', 12, true);
          public          dbadmin    false    222            m           0    0    main_instructionset_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.main_instructionset_id_seq', 4, true);
          public          dbadmin    false    224            n           0    0    main_parameters_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.main_parameters_id_seq', 1, true);
          public          dbadmin    false    226            o           0    0    main_parameterset_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.main_parameterset_id_seq', 22, true);
          public          dbadmin    false    228            p           0    0    main_parametersetbarrier_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.main_parametersetbarrier_id_seq', 7, true);
          public          dbadmin    false    249            q           0    0 4   main_parametersetbarrier_parameter_set_groups_id_seq    SEQUENCE SET     b   SELECT pg_catalog.setval('public.main_parametersetbarrier_parameter_set_groups_id_seq', 3, true);
          public          dbadmin    false    251            r           0    0 5   main_parametersetbarrier_parameter_set_players_id_seq    SEQUENCE SET     c   SELECT pg_catalog.setval('public.main_parametersetbarrier_parameter_set_players_id_seq', 3, true);
          public          dbadmin    false    257            s           0    0    main_parametersetground_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.main_parametersetground_id_seq', 5, true);
          public          dbadmin    false    253            t           0    0    main_parametersetgroup_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.main_parametersetgroup_id_seq', 20, true);
          public          dbadmin    false    247            u           0    0    main_parametersetnotice_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.main_parametersetnotice_id_seq', 5, true);
          public          dbadmin    false    243            v           0    0    main_parametersetplayer_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.main_parametersetplayer_id_seq', 268, true);
          public          dbadmin    false    230            w           0    0    main_parametersetwall_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.main_parametersetwall_id_seq', 10, true);
          public          dbadmin    false    245            x           0    0    main_profileloginattempt_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.main_profileloginattempt_id_seq', 1, true);
          public          dbadmin    false    259            y           0    0 !   main_session_collaborators_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.main_session_collaborators_id_seq', 1, false);
          public          dbadmin    false    233            z           0    0    main_session_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.main_session_id_seq', 21, true);
          public          dbadmin    false    234            {           0    0    main_sessionevent_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.main_sessionevent_id_seq', 12547, true);
          public          dbadmin    false    241            |           0    0    main_sessionperiod_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.main_sessionperiod_id_seq', 3647, true);
          public          dbadmin    false    236            }           0    0    main_sessionplayer_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.main_sessionplayer_id_seq', 1171, true);
          public          dbadmin    false    238            ~           0    0    main_sessionplayerperiod_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.main_sessionplayerperiod_id_seq', 28869, true);
          public          dbadmin    false    240            �           2606    37666    auth_group auth_group_name_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);
 H   ALTER TABLE ONLY public.auth_group DROP CONSTRAINT auth_group_name_key;
       public            dbadmin    false    200            �           2606    37668 R   auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);
 |   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
       public            dbadmin    false    202    202            �           2606    37670 2   auth_group_permissions auth_group_permissions_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissions_pkey;
       public            dbadmin    false    202            �           2606    37672    auth_group auth_group_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.auth_group DROP CONSTRAINT auth_group_pkey;
       public            dbadmin    false    200            �           2606    37674 F   auth_permission auth_permission_content_type_id_codename_01ab375a_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);
 p   ALTER TABLE ONLY public.auth_permission DROP CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq;
       public            dbadmin    false    204    204            �           2606    37676 $   auth_permission auth_permission_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.auth_permission DROP CONSTRAINT auth_permission_pkey;
       public            dbadmin    false    204            �           2606    37678 &   auth_user_groups auth_user_groups_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.auth_user_groups DROP CONSTRAINT auth_user_groups_pkey;
       public            dbadmin    false    207            �           2606    37680 @   auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);
 j   ALTER TABLE ONLY public.auth_user_groups DROP CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq;
       public            dbadmin    false    207    207            �           2606    37682    auth_user auth_user_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.auth_user DROP CONSTRAINT auth_user_pkey;
       public            dbadmin    false    206            �           2606    37684 :   auth_user_user_permissions auth_user_user_permissions_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.auth_user_user_permissions DROP CONSTRAINT auth_user_user_permissions_pkey;
       public            dbadmin    false    210            �           2606    37686 Y   auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);
 �   ALTER TABLE ONLY public.auth_user_user_permissions DROP CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq;
       public            dbadmin    false    210    210            �           2606    37688     auth_user auth_user_username_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);
 J   ALTER TABLE ONLY public.auth_user DROP CONSTRAINT auth_user_username_key;
       public            dbadmin    false    206            �           2606    37690 &   django_admin_log django_admin_log_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.django_admin_log DROP CONSTRAINT django_admin_log_pkey;
       public            dbadmin    false    212                       2606    37692 E   django_content_type django_content_type_app_label_model_76bd3d3b_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);
 o   ALTER TABLE ONLY public.django_content_type DROP CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq;
       public            dbadmin    false    214    214                       2606    37694 ,   django_content_type django_content_type_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.django_content_type DROP CONSTRAINT django_content_type_pkey;
       public            dbadmin    false    214                       2606    37696 (   django_migrations django_migrations_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.django_migrations DROP CONSTRAINT django_migrations_pkey;
       public            dbadmin    false    216            	           2606    37698 "   django_session django_session_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);
 L   ALTER TABLE ONLY public.django_session DROP CONSTRAINT django_session_pkey;
       public            dbadmin    false    218                       2606    37700     main_helpdocs main_helpdocs_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.main_helpdocs
    ADD CONSTRAINT main_helpdocs_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.main_helpdocs DROP CONSTRAINT main_helpdocs_pkey;
       public            dbadmin    false    219            W           2606    552133 .   main_helpdocssubject main_helpdocssubject_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.main_helpdocssubject
    ADD CONSTRAINT main_helpdocssubject_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.main_helpdocssubject DROP CONSTRAINT main_helpdocssubject_pkey;
       public            dbadmin    false    256                       2606    37702 &   main_instruction main_instruction_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.main_instruction
    ADD CONSTRAINT main_instruction_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.main_instruction DROP CONSTRAINT main_instruction_pkey;
       public            dbadmin    false    221                       2606    37704 ,   main_instructionset main_instructionset_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.main_instructionset
    ADD CONSTRAINT main_instructionset_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.main_instructionset DROP CONSTRAINT main_instructionset_pkey;
       public            dbadmin    false    223                       2606    37706 $   main_parameters main_parameters_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.main_parameters
    ADD CONSTRAINT main_parameters_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.main_parameters DROP CONSTRAINT main_parameters_pkey;
       public            dbadmin    false    225                       2606    37708 (   main_parameterset main_parameterset_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.main_parameterset
    ADD CONSTRAINT main_parameterset_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.main_parameterset DROP CONSTRAINT main_parameterset_pkey;
       public            dbadmin    false    227            O           2606    537711 `   main_parametersetbarrier_parameter_set_groups main_parametersetbarrier_parameter_set_groups_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups
    ADD CONSTRAINT main_parametersetbarrier_parameter_set_groups_pkey PRIMARY KEY (id);
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups DROP CONSTRAINT main_parametersetbarrier_parameter_set_groups_pkey;
       public            dbadmin    false    252            ]           2606    560480 b   main_parametersetbarrier_parameter_set_players main_parametersetbarrier_parameter_set_players_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players
    ADD CONSTRAINT main_parametersetbarrier_parameter_set_players_pkey PRIMARY KEY (id);
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players DROP CONSTRAINT main_parametersetbarrier_parameter_set_players_pkey;
       public            dbadmin    false    258            Q           2606    537719 m   main_parametersetbarrier_parameter_set_groups main_parametersetbarrier_parametersetbarrier_id_p_9b2a6dab_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups
    ADD CONSTRAINT main_parametersetbarrier_parametersetbarrier_id_p_9b2a6dab_uniq UNIQUE (parametersetbarrier_id, parametersetgroup_id);
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups DROP CONSTRAINT main_parametersetbarrier_parametersetbarrier_id_p_9b2a6dab_uniq;
       public            dbadmin    false    252    252            _           2606    560482 n   main_parametersetbarrier_parameter_set_players main_parametersetbarrier_parametersetbarrier_id_p_d9c33672_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players
    ADD CONSTRAINT main_parametersetbarrier_parametersetbarrier_id_p_d9c33672_uniq UNIQUE (parametersetbarrier_id, parametersetplayer_id);
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players DROP CONSTRAINT main_parametersetbarrier_parametersetbarrier_id_p_d9c33672_uniq;
       public            dbadmin    false    258    258            K           2606    537704 6   main_parametersetbarrier main_parametersetbarrier_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.main_parametersetbarrier
    ADD CONSTRAINT main_parametersetbarrier_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.main_parametersetbarrier DROP CONSTRAINT main_parametersetbarrier_pkey;
       public            dbadmin    false    250            T           2606    552080 4   main_parametersetground main_parametersetground_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.main_parametersetground
    ADD CONSTRAINT main_parametersetground_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.main_parametersetground DROP CONSTRAINT main_parametersetground_pkey;
       public            dbadmin    false    254            H           2606    537685 2   main_parametersetgroup main_parametersetgroup_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.main_parametersetgroup
    ADD CONSTRAINT main_parametersetgroup_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.main_parametersetgroup DROP CONSTRAINT main_parametersetgroup_pkey;
       public            dbadmin    false    248            B           2606    537025 4   main_parametersetnotice main_parametersetnotice_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.main_parametersetnotice
    ADD CONSTRAINT main_parametersetnotice_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.main_parametersetnotice DROP CONSTRAINT main_parametersetnotice_pkey;
       public            dbadmin    false    244                       2606    37710 4   main_parametersetplayer main_parametersetplayer_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.main_parametersetplayer
    ADD CONSTRAINT main_parametersetplayer_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.main_parametersetplayer DROP CONSTRAINT main_parametersetplayer_pkey;
       public            dbadmin    false    229            E           2606    537398 0   main_parametersetwall main_parametersetwall_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.main_parametersetwall
    ADD CONSTRAINT main_parametersetwall_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.main_parametersetwall DROP CONSTRAINT main_parametersetwall_pkey;
       public            dbadmin    false    246            b           2606    676911 6   main_profileloginattempt main_profileloginattempt_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.main_profileloginattempt
    ADD CONSTRAINT main_profileloginattempt_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.main_profileloginattempt DROP CONSTRAINT main_profileloginattempt_pkey;
       public            dbadmin    false    260            '           2606    37712 :   main_session_collaborators main_session_collaborators_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.main_session_collaborators
    ADD CONSTRAINT main_session_collaborators_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.main_session_collaborators DROP CONSTRAINT main_session_collaborators_pkey;
       public            dbadmin    false    232            *           2606    37714 V   main_session_collaborators main_session_collaborators_session_id_user_id_a9fa04c6_uniq 
   CONSTRAINT     �   ALTER TABLE ONLY public.main_session_collaborators
    ADD CONSTRAINT main_session_collaborators_session_id_user_id_a9fa04c6_uniq UNIQUE (session_id, user_id);
 �   ALTER TABLE ONLY public.main_session_collaborators DROP CONSTRAINT main_session_collaborators_session_id_user_id_a9fa04c6_uniq;
       public            dbadmin    false    232    232            "           2606    634001 '   main_session main_session_id_string_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.main_session
    ADD CONSTRAINT main_session_id_string_key UNIQUE (id_string);
 Q   ALTER TABLE ONLY public.main_session DROP CONSTRAINT main_session_id_string_key;
       public            dbadmin    false    231            %           2606    37716    main_session main_session_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.main_session
    ADD CONSTRAINT main_session_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.main_session DROP CONSTRAINT main_session_pkey;
       public            dbadmin    false    231            =           2606    403168 (   main_sessionevent main_sessionevent_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.main_sessionevent
    ADD CONSTRAINT main_sessionevent_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.main_sessionevent DROP CONSTRAINT main_sessionevent_pkey;
       public            dbadmin    false    242            -           2606    37718 *   main_sessionperiod main_sessionperiod_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.main_sessionperiod
    ADD CONSTRAINT main_sessionperiod_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.main_sessionperiod DROP CONSTRAINT main_sessionperiod_pkey;
       public            dbadmin    false    235            3           2606    37720 *   main_sessionplayer main_sessionplayer_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.main_sessionplayer
    ADD CONSTRAINT main_sessionplayer_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.main_sessionplayer DROP CONSTRAINT main_sessionplayer_pkey;
       public            dbadmin    false    237            7           2606    37728 6   main_sessionplayerperiod main_sessionplayerperiod_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.main_sessionplayerperiod
    ADD CONSTRAINT main_sessionplayerperiod_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.main_sessionplayerperiod DROP CONSTRAINT main_sessionplayerperiod_pkey;
       public            dbadmin    false    239            0           2606    37730    main_sessionperiod unique_SD 
   CONSTRAINT     n   ALTER TABLE ONLY public.main_sessionperiod
    ADD CONSTRAINT "unique_SD" UNIQUE (session_id, period_number);
 H   ALTER TABLE ONLY public.main_sessionperiod DROP CONSTRAINT "unique_SD";
       public            dbadmin    false    235    235                       2606    37732    main_helpdocs unique_help_doc 
   CONSTRAINT     Y   ALTER TABLE ONLY public.main_helpdocs
    ADD CONSTRAINT unique_help_doc UNIQUE (title);
 G   ALTER TABLE ONLY public.main_helpdocs DROP CONSTRAINT unique_help_doc;
       public            dbadmin    false    219            Y           2606    552135 ,   main_helpdocssubject unique_help_doc_subject 
   CONSTRAINT     |   ALTER TABLE ONLY public.main_helpdocssubject
    ADD CONSTRAINT unique_help_doc_subject UNIQUE (instruction_set_id, title);
 V   ALTER TABLE ONLY public.main_helpdocssubject DROP CONSTRAINT unique_help_doc_subject;
       public            dbadmin    false    256    256                       2606    37734 *   main_instructionset unique_instruction_set 
   CONSTRAINT     f   ALTER TABLE ONLY public.main_instructionset
    ADD CONSTRAINT unique_instruction_set UNIQUE (label);
 T   ALTER TABLE ONLY public.main_instructionset DROP CONSTRAINT unique_instruction_set;
       public            dbadmin    false    223            ;           2606    37736 5   main_sessionplayerperiod unique_session_player_period 
   CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionplayerperiod
    ADD CONSTRAINT unique_session_player_period UNIQUE (session_player_id, session_period_id);
 _   ALTER TABLE ONLY public.main_sessionplayerperiod DROP CONSTRAINT unique_session_player_period;
       public            dbadmin    false    239    239            �           1259    37737    auth_group_name_a6ea08ec_like    INDEX     h   CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);
 1   DROP INDEX public.auth_group_name_a6ea08ec_like;
       public            dbadmin    false    200            �           1259    37738 (   auth_group_permissions_group_id_b120cbf9    INDEX     o   CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);
 <   DROP INDEX public.auth_group_permissions_group_id_b120cbf9;
       public            dbadmin    false    202            �           1259    37739 -   auth_group_permissions_permission_id_84c5c92e    INDEX     y   CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);
 A   DROP INDEX public.auth_group_permissions_permission_id_84c5c92e;
       public            dbadmin    false    202            �           1259    37740 (   auth_permission_content_type_id_2f476e4b    INDEX     o   CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);
 <   DROP INDEX public.auth_permission_content_type_id_2f476e4b;
       public            dbadmin    false    204            �           1259    37741 "   auth_user_groups_group_id_97559544    INDEX     c   CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);
 6   DROP INDEX public.auth_user_groups_group_id_97559544;
       public            dbadmin    false    207            �           1259    37742 !   auth_user_groups_user_id_6a12ed8b    INDEX     a   CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);
 5   DROP INDEX public.auth_user_groups_user_id_6a12ed8b;
       public            dbadmin    false    207            �           1259    37743 1   auth_user_user_permissions_permission_id_1fbb5f2c    INDEX     �   CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);
 E   DROP INDEX public.auth_user_user_permissions_permission_id_1fbb5f2c;
       public            dbadmin    false    210            �           1259    37744 +   auth_user_user_permissions_user_id_a95ead1b    INDEX     u   CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);
 ?   DROP INDEX public.auth_user_user_permissions_user_id_a95ead1b;
       public            dbadmin    false    210            �           1259    37745     auth_user_username_6821ab7c_like    INDEX     n   CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);
 4   DROP INDEX public.auth_user_username_6821ab7c_like;
       public            dbadmin    false    206            �           1259    37746 )   django_admin_log_content_type_id_c4bce8eb    INDEX     q   CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);
 =   DROP INDEX public.django_admin_log_content_type_id_c4bce8eb;
       public            dbadmin    false    212                        1259    37747 !   django_admin_log_user_id_c564eba6    INDEX     a   CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);
 5   DROP INDEX public.django_admin_log_user_id_c564eba6;
       public            dbadmin    false    212                       1259    37748 #   django_session_expire_date_a5c62663    INDEX     e   CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);
 7   DROP INDEX public.django_session_expire_date_a5c62663;
       public            dbadmin    false    218            
           1259    37749 (   django_session_session_key_c0390e0f_like    INDEX     ~   CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);
 <   DROP INDEX public.django_session_session_key_c0390e0f_like;
       public            dbadmin    false    218            U           1259    552141 0   main_helpdocssubject_instruction_set_id_c991d927    INDEX        CREATE INDEX main_helpdocssubject_instruction_set_id_c991d927 ON public.main_helpdocssubject USING btree (instruction_set_id);
 D   DROP INDEX public.main_helpdocssubject_instruction_set_id_c991d927;
       public            dbadmin    false    256                       1259    37750 ,   main_instruction_instruction_set_id_5d040393    INDEX     w   CREATE INDEX main_instruction_instruction_set_id_5d040393 ON public.main_instruction USING btree (instruction_set_id);
 @   DROP INDEX public.main_instruction_instruction_set_id_5d040393;
       public            dbadmin    false    221            L           1259    537730 :   main_parametersetbarrier_p_parametersetbarrier_id_22c4567e    INDEX     �   CREATE INDEX main_parametersetbarrier_p_parametersetbarrier_id_22c4567e ON public.main_parametersetbarrier_parameter_set_groups USING btree (parametersetbarrier_id);
 N   DROP INDEX public.main_parametersetbarrier_p_parametersetbarrier_id_22c4567e;
       public            dbadmin    false    252            Z           1259    560493 :   main_parametersetbarrier_p_parametersetbarrier_id_89d624d5    INDEX     �   CREATE INDEX main_parametersetbarrier_p_parametersetbarrier_id_89d624d5 ON public.main_parametersetbarrier_parameter_set_players USING btree (parametersetbarrier_id);
 N   DROP INDEX public.main_parametersetbarrier_p_parametersetbarrier_id_89d624d5;
       public            dbadmin    false    258            M           1259    537731 8   main_parametersetbarrier_p_parametersetgroup_id_56c8239f    INDEX     �   CREATE INDEX main_parametersetbarrier_p_parametersetgroup_id_56c8239f ON public.main_parametersetbarrier_parameter_set_groups USING btree (parametersetgroup_id);
 L   DROP INDEX public.main_parametersetbarrier_p_parametersetgroup_id_56c8239f;
       public            dbadmin    false    252            [           1259    560494 9   main_parametersetbarrier_p_parametersetplayer_id_4d40cf4f    INDEX     �   CREATE INDEX main_parametersetbarrier_p_parametersetplayer_id_4d40cf4f ON public.main_parametersetbarrier_parameter_set_players USING btree (parametersetplayer_id);
 M   DROP INDEX public.main_parametersetbarrier_p_parametersetplayer_id_4d40cf4f;
       public            dbadmin    false    258            I           1259    537717 2   main_parametersetbarrier_parameter_set_id_cf154678    INDEX     �   CREATE INDEX main_parametersetbarrier_parameter_set_id_cf154678 ON public.main_parametersetbarrier USING btree (parameter_set_id);
 F   DROP INDEX public.main_parametersetbarrier_parameter_set_id_cf154678;
       public            dbadmin    false    250            R           1259    552086 1   main_parametersetground_parameter_set_id_be2ee494    INDEX     �   CREATE INDEX main_parametersetground_parameter_set_id_be2ee494 ON public.main_parametersetground USING btree (parameter_set_id);
 E   DROP INDEX public.main_parametersetground_parameter_set_id_be2ee494;
       public            dbadmin    false    254            F           1259    537696 0   main_parametersetgroup_parameter_set_id_68302e54    INDEX        CREATE INDEX main_parametersetgroup_parameter_set_id_68302e54 ON public.main_parametersetgroup USING btree (parameter_set_id);
 D   DROP INDEX public.main_parametersetgroup_parameter_set_id_68302e54;
       public            dbadmin    false    248            @           1259    537031 1   main_parametersetnotice_parameter_set_id_3c247b48    INDEX     �   CREATE INDEX main_parametersetnotice_parameter_set_id_3c247b48 ON public.main_parametersetnotice USING btree (parameter_set_id);
 E   DROP INDEX public.main_parametersetnotice_parameter_set_id_3c247b48;
       public            dbadmin    false    244                       1259    676901 3   main_parametersetplayer_instruction_set_id_cce2dbba    INDEX     �   CREATE INDEX main_parametersetplayer_instruction_set_id_cce2dbba ON public.main_parametersetplayer USING btree (instruction_set_id);
 G   DROP INDEX public.main_parametersetplayer_instruction_set_id_cce2dbba;
       public            dbadmin    false    229                       1259    537697 7   main_parametersetplayer_parameter_set_group_id_4245d53a    INDEX     �   CREATE INDEX main_parametersetplayer_parameter_set_group_id_4245d53a ON public.main_parametersetplayer USING btree (parameter_set_group_id);
 K   DROP INDEX public.main_parametersetplayer_parameter_set_group_id_4245d53a;
       public            dbadmin    false    229                       1259    37752 1   main_parametersetplayer_parameter_set_id_5bd0808d    INDEX     �   CREATE INDEX main_parametersetplayer_parameter_set_id_5bd0808d ON public.main_parametersetplayer USING btree (parameter_set_id);
 E   DROP INDEX public.main_parametersetplayer_parameter_set_id_5bd0808d;
       public            dbadmin    false    229            C           1259    537404 /   main_parametersetwall_parameter_set_id_18385b5f    INDEX     }   CREATE INDEX main_parametersetwall_parameter_set_id_18385b5f ON public.main_parametersetwall USING btree (parameter_set_id);
 C   DROP INDEX public.main_parametersetwall_parameter_set_id_18385b5f;
       public            dbadmin    false    246            `           1259    676917 /   main_profileloginattempt_my_profile_id_d01d716e    INDEX     w   CREATE INDEX main_profileloginattempt_my_profile_id_d01d716e ON public.main_profileloginattempt USING btree (user_id);
 C   DROP INDEX public.main_profileloginattempt_my_profile_id_d01d716e;
       public            dbadmin    false    260            (           1259    37753 .   main_session_collaborators_session_id_a242089d    INDEX     {   CREATE INDEX main_session_collaborators_session_id_a242089d ON public.main_session_collaborators USING btree (session_id);
 B   DROP INDEX public.main_session_collaborators_session_id_a242089d;
       public            dbadmin    false    232            +           1259    37754 +   main_session_collaborators_user_id_c6ff0f1c    INDEX     u   CREATE INDEX main_session_collaborators_user_id_c6ff0f1c ON public.main_session_collaborators USING btree (user_id);
 ?   DROP INDEX public.main_session_collaborators_user_id_c6ff0f1c;
       public            dbadmin    false    232                       1259    37755     main_session_creator_id_0e707742    INDEX     _   CREATE INDEX main_session_creator_id_0e707742 ON public.main_session USING btree (creator_id);
 4   DROP INDEX public.main_session_creator_id_0e707742;
       public            dbadmin    false    231                        1259    634002 $   main_session_id_string_2f469789_like    INDEX     v   CREATE INDEX main_session_id_string_2f469789_like ON public.main_session USING btree (id_string varchar_pattern_ops);
 8   DROP INDEX public.main_session_id_string_2f469789_like;
       public            dbadmin    false    231            #           1259    37756 &   main_session_parameter_set_id_e04ecadf    INDEX     k   CREATE INDEX main_session_parameter_set_id_e04ecadf ON public.main_session USING btree (parameter_set_id);
 :   DROP INDEX public.main_session_parameter_set_id_e04ecadf;
       public            dbadmin    false    231            >           1259    403181 %   main_sessionevent_session_id_9e370fb8    INDEX     i   CREATE INDEX main_sessionevent_session_id_9e370fb8 ON public.main_sessionevent USING btree (session_id);
 9   DROP INDEX public.main_sessionevent_session_id_9e370fb8;
       public            dbadmin    false    242            ?           1259    410992 ,   main_sessionevent_session_player_id_fc5852d6    INDEX     w   CREATE INDEX main_sessionevent_session_player_id_fc5852d6 ON public.main_sessionevent USING btree (session_player_id);
 @   DROP INDEX public.main_sessionevent_session_player_id_fc5852d6;
       public            dbadmin    false    242            .           1259    37757 &   main_sessionperiod_session_id_1e0c2ed1    INDEX     k   CREATE INDEX main_sessionperiod_session_id_1e0c2ed1 ON public.main_sessionperiod USING btree (session_id);
 :   DROP INDEX public.main_sessionperiod_session_id_1e0c2ed1;
       public            dbadmin    false    235            1           1259    37758 3   main_sessionplayer_parameter_set_player_id_c5656d27    INDEX     �   CREATE INDEX main_sessionplayer_parameter_set_player_id_c5656d27 ON public.main_sessionplayer USING btree (parameter_set_player_id);
 G   DROP INDEX public.main_sessionplayer_parameter_set_player_id_c5656d27;
       public            dbadmin    false    237            4           1259    37759 &   main_sessionplayer_session_id_8dd9114b    INDEX     k   CREATE INDEX main_sessionplayer_session_id_8dd9114b ON public.main_sessionplayer USING btree (session_id);
 :   DROP INDEX public.main_sessionplayer_session_id_8dd9114b;
       public            dbadmin    false    237            8           1259    37764 3   main_sessionplayerperiod_session_period_id_7c1e4dad    INDEX     �   CREATE INDEX main_sessionplayerperiod_session_period_id_7c1e4dad ON public.main_sessionplayerperiod USING btree (session_period_id);
 G   DROP INDEX public.main_sessionplayerperiod_session_period_id_7c1e4dad;
       public            dbadmin    false    239            9           1259    37765 3   main_sessionplayerperiod_session_player_id_8b774212    INDEX     �   CREATE INDEX main_sessionplayerperiod_session_player_id_8b774212 ON public.main_sessionplayerperiod USING btree (session_player_id);
 G   DROP INDEX public.main_sessionplayerperiod_session_player_id_8b774212;
       public            dbadmin    false    239            5           1259    37766    unique_email_session_player    INDEX     �   CREATE UNIQUE INDEX unique_email_session_player ON public.main_sessionplayer USING btree (session_id, email) WHERE (NOT (((email)::text = ''::text) AND (email IS NOT NULL)));
 /   DROP INDEX public.unique_email_session_player;
       public            dbadmin    false    237    237    237            c           2606    37767 O   auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;
 y   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
       public          dbadmin    false    3051    204    202            d           2606    37772 P   auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;
 z   ALTER TABLE ONLY public.auth_group_permissions DROP CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
       public          dbadmin    false    3040    202    200            e           2606    37777 E   auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;
 o   ALTER TABLE ONLY public.auth_permission DROP CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co;
       public          dbadmin    false    214    3076    204            f           2606    37782 D   auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;
 n   ALTER TABLE ONLY public.auth_user_groups DROP CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id;
       public          dbadmin    false    3040    207    200            g           2606    37787 B   auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;
 l   ALTER TABLE ONLY public.auth_user_groups DROP CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
       public          dbadmin    false    207    206    3053            h           2606    37792 S   auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;
 }   ALTER TABLE ONLY public.auth_user_user_permissions DROP CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
       public          dbadmin    false    210    204    3051            i           2606    37797 V   auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;
 �   ALTER TABLE ONLY public.auth_user_user_permissions DROP CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
       public          dbadmin    false    3053    210    206            j           2606    37802 G   django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co    FK CONSTRAINT     �   ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;
 q   ALTER TABLE ONLY public.django_admin_log DROP CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co;
       public          dbadmin    false    214    3076    212            k           2606    37807 B   django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;
 l   ALTER TABLE ONLY public.django_admin_log DROP CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id;
       public          dbadmin    false    206    3053    212            �           2606    552136 R   main_helpdocssubject main_helpdocssubject_instruction_set_id_c991d927_fk_main_inst    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_helpdocssubject
    ADD CONSTRAINT main_helpdocssubject_instruction_set_id_c991d927_fk_main_inst FOREIGN KEY (instruction_set_id) REFERENCES public.main_instructionset(id) DEFERRABLE INITIALLY DEFERRED;
 |   ALTER TABLE ONLY public.main_helpdocssubject DROP CONSTRAINT main_helpdocssubject_instruction_set_id_c991d927_fk_main_inst;
       public          dbadmin    false    256    3091    223            l           2606    37812 J   main_instruction main_instruction_instruction_set_id_5d040393_fk_main_inst    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_instruction
    ADD CONSTRAINT main_instruction_instruction_set_id_5d040393_fk_main_inst FOREIGN KEY (instruction_set_id) REFERENCES public.main_instructionset(id) DEFERRABLE INITIALLY DEFERRED;
 t   ALTER TABLE ONLY public.main_instruction DROP CONSTRAINT main_instruction_instruction_set_id_5d040393_fk_main_inst;
       public          dbadmin    false    221    223    3091            ~           2606    537712 T   main_parametersetbarrier main_parametersetbar_parameter_set_id_cf154678_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetbarrier
    ADD CONSTRAINT main_parametersetbar_parameter_set_id_cf154678_fk_main_para FOREIGN KEY (parameter_set_id) REFERENCES public.main_parameterset(id) DEFERRABLE INITIALLY DEFERRED;
 ~   ALTER TABLE ONLY public.main_parametersetbarrier DROP CONSTRAINT main_parametersetbar_parameter_set_id_cf154678_fk_main_para;
       public          dbadmin    false    250    227    3097                       2606    537720 m   main_parametersetbarrier_parameter_set_groups main_parametersetbar_parametersetbarrier__22c4567e_fk_main_para    FK CONSTRAINT       ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups
    ADD CONSTRAINT main_parametersetbar_parametersetbarrier__22c4567e_fk_main_para FOREIGN KEY (parametersetbarrier_id) REFERENCES public.main_parametersetbarrier(id) DEFERRABLE INITIALLY DEFERRED;
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups DROP CONSTRAINT main_parametersetbar_parametersetbarrier__22c4567e_fk_main_para;
       public          dbadmin    false    3147    250    252            �           2606    560483 n   main_parametersetbarrier_parameter_set_players main_parametersetbar_parametersetbarrier__89d624d5_fk_main_para    FK CONSTRAINT       ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players
    ADD CONSTRAINT main_parametersetbar_parametersetbarrier__89d624d5_fk_main_para FOREIGN KEY (parametersetbarrier_id) REFERENCES public.main_parametersetbarrier(id) DEFERRABLE INITIALLY DEFERRED;
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players DROP CONSTRAINT main_parametersetbar_parametersetbarrier__89d624d5_fk_main_para;
       public          dbadmin    false    250    258    3147            �           2606    537725 m   main_parametersetbarrier_parameter_set_groups main_parametersetbar_parametersetgroup_id_56c8239f_fk_main_para    FK CONSTRAINT       ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups
    ADD CONSTRAINT main_parametersetbar_parametersetgroup_id_56c8239f_fk_main_para FOREIGN KEY (parametersetgroup_id) REFERENCES public.main_parametersetgroup(id) DEFERRABLE INITIALLY DEFERRED;
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_groups DROP CONSTRAINT main_parametersetbar_parametersetgroup_id_56c8239f_fk_main_para;
       public          dbadmin    false    248    3144    252            �           2606    560488 n   main_parametersetbarrier_parameter_set_players main_parametersetbar_parametersetplayer_i_4d40cf4f_fk_main_para    FK CONSTRAINT       ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players
    ADD CONSTRAINT main_parametersetbar_parametersetplayer_i_4d40cf4f_fk_main_para FOREIGN KEY (parametersetplayer_id) REFERENCES public.main_parametersetplayer(id) DEFERRABLE INITIALLY DEFERRED;
 �   ALTER TABLE ONLY public.main_parametersetbarrier_parameter_set_players DROP CONSTRAINT main_parametersetbar_parametersetplayer_i_4d40cf4f_fk_main_para;
       public          dbadmin    false    3102    229    258            }           2606    537691 R   main_parametersetgroup main_parametersetgro_parameter_set_id_68302e54_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetgroup
    ADD CONSTRAINT main_parametersetgro_parameter_set_id_68302e54_fk_main_para FOREIGN KEY (parameter_set_id) REFERENCES public.main_parameterset(id) DEFERRABLE INITIALLY DEFERRED;
 |   ALTER TABLE ONLY public.main_parametersetgroup DROP CONSTRAINT main_parametersetgro_parameter_set_id_68302e54_fk_main_para;
       public          dbadmin    false    227    3097    248            �           2606    552081 S   main_parametersetground main_parametersetgro_parameter_set_id_be2ee494_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetground
    ADD CONSTRAINT main_parametersetgro_parameter_set_id_be2ee494_fk_main_para FOREIGN KEY (parameter_set_id) REFERENCES public.main_parameterset(id) DEFERRABLE INITIALLY DEFERRED;
 }   ALTER TABLE ONLY public.main_parametersetground DROP CONSTRAINT main_parametersetgro_parameter_set_id_be2ee494_fk_main_para;
       public          dbadmin    false    227    254    3097            {           2606    537026 S   main_parametersetnotice main_parametersetnot_parameter_set_id_3c247b48_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetnotice
    ADD CONSTRAINT main_parametersetnot_parameter_set_id_3c247b48_fk_main_para FOREIGN KEY (parameter_set_id) REFERENCES public.main_parameterset(id) DEFERRABLE INITIALLY DEFERRED;
 }   ALTER TABLE ONLY public.main_parametersetnotice DROP CONSTRAINT main_parametersetnot_parameter_set_id_3c247b48_fk_main_para;
       public          dbadmin    false    244    3097    227            m           2606    676896 U   main_parametersetplayer main_parametersetpla_instruction_set_id_cce2dbba_fk_main_inst    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetplayer
    ADD CONSTRAINT main_parametersetpla_instruction_set_id_cce2dbba_fk_main_inst FOREIGN KEY (instruction_set_id) REFERENCES public.main_instructionset(id) DEFERRABLE INITIALLY DEFERRED;
    ALTER TABLE ONLY public.main_parametersetplayer DROP CONSTRAINT main_parametersetpla_instruction_set_id_cce2dbba_fk_main_inst;
       public          dbadmin    false    223    229    3091            n           2606    537686 W   main_parametersetplayer main_parametersetpla_parameter_set_group__4245d53a_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetplayer
    ADD CONSTRAINT main_parametersetpla_parameter_set_group__4245d53a_fk_main_para FOREIGN KEY (parameter_set_group_id) REFERENCES public.main_parametersetgroup(id) DEFERRABLE INITIALLY DEFERRED;
 �   ALTER TABLE ONLY public.main_parametersetplayer DROP CONSTRAINT main_parametersetpla_parameter_set_group__4245d53a_fk_main_para;
       public          dbadmin    false    3144    248    229            o           2606    37822 S   main_parametersetplayer main_parametersetpla_parameter_set_id_5bd0808d_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetplayer
    ADD CONSTRAINT main_parametersetpla_parameter_set_id_5bd0808d_fk_main_para FOREIGN KEY (parameter_set_id) REFERENCES public.main_parameterset(id) DEFERRABLE INITIALLY DEFERRED;
 }   ALTER TABLE ONLY public.main_parametersetplayer DROP CONSTRAINT main_parametersetpla_parameter_set_id_5bd0808d_fk_main_para;
       public          dbadmin    false    3097    227    229            |           2606    537399 Q   main_parametersetwall main_parametersetwal_parameter_set_id_18385b5f_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_parametersetwall
    ADD CONSTRAINT main_parametersetwal_parameter_set_id_18385b5f_fk_main_para FOREIGN KEY (parameter_set_id) REFERENCES public.main_parameterset(id) DEFERRABLE INITIALLY DEFERRED;
 {   ALTER TABLE ONLY public.main_parametersetwall DROP CONSTRAINT main_parametersetwal_parameter_set_id_18385b5f_fk_main_para;
       public          dbadmin    false    246    3097    227            �           2606    676918 R   main_profileloginattempt main_profileloginattempt_user_id_a5d26eab_fk_auth_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_profileloginattempt
    ADD CONSTRAINT main_profileloginattempt_user_id_a5d26eab_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;
 |   ALTER TABLE ONLY public.main_profileloginattempt DROP CONSTRAINT main_profileloginattempt_user_id_a5d26eab_fk_auth_user_id;
       public          dbadmin    false    3053    206    260            r           2606    37827 P   main_session_collaborators main_session_collabo_session_id_a242089d_fk_main_sess    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_session_collaborators
    ADD CONSTRAINT main_session_collabo_session_id_a242089d_fk_main_sess FOREIGN KEY (session_id) REFERENCES public.main_session(id) DEFERRABLE INITIALLY DEFERRED;
 z   ALTER TABLE ONLY public.main_session_collaborators DROP CONSTRAINT main_session_collabo_session_id_a242089d_fk_main_sess;
       public          dbadmin    false    232    3109    231            s           2606    37832 V   main_session_collaborators main_session_collaborators_user_id_c6ff0f1c_fk_auth_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_session_collaborators
    ADD CONSTRAINT main_session_collaborators_user_id_c6ff0f1c_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;
 �   ALTER TABLE ONLY public.main_session_collaborators DROP CONSTRAINT main_session_collaborators_user_id_c6ff0f1c_fk_auth_user_id;
       public          dbadmin    false    232    3053    206            p           2606    37837 =   main_session main_session_creator_id_0e707742_fk_auth_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_session
    ADD CONSTRAINT main_session_creator_id_0e707742_fk_auth_user_id FOREIGN KEY (creator_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;
 g   ALTER TABLE ONLY public.main_session DROP CONSTRAINT main_session_creator_id_0e707742_fk_auth_user_id;
       public          dbadmin    false    3053    231    206            q           2606    37842 K   main_session main_session_parameter_set_id_e04ecadf_fk_main_parameterset_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_session
    ADD CONSTRAINT main_session_parameter_set_id_e04ecadf_fk_main_parameterset_id FOREIGN KEY (parameter_set_id) REFERENCES public.main_parameterset(id) DEFERRABLE INITIALLY DEFERRED;
 u   ALTER TABLE ONLY public.main_session DROP CONSTRAINT main_session_parameter_set_id_e04ecadf_fk_main_parameterset_id;
       public          dbadmin    false    231    227    3097            y           2606    403176 J   main_sessionevent main_sessionevent_session_id_9e370fb8_fk_main_session_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionevent
    ADD CONSTRAINT main_sessionevent_session_id_9e370fb8_fk_main_session_id FOREIGN KEY (session_id) REFERENCES public.main_session(id) DEFERRABLE INITIALLY DEFERRED;
 t   ALTER TABLE ONLY public.main_sessionevent DROP CONSTRAINT main_sessionevent_session_id_9e370fb8_fk_main_session_id;
       public          dbadmin    false    242    231    3109            z           2606    410987 K   main_sessionevent main_sessionevent_session_player_id_fc5852d6_fk_main_sess    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionevent
    ADD CONSTRAINT main_sessionevent_session_player_id_fc5852d6_fk_main_sess FOREIGN KEY (session_player_id) REFERENCES public.main_sessionplayer(id) DEFERRABLE INITIALLY DEFERRED;
 u   ALTER TABLE ONLY public.main_sessionevent DROP CONSTRAINT main_sessionevent_session_player_id_fc5852d6_fk_main_sess;
       public          dbadmin    false    242    3123    237            t           2606    37847 L   main_sessionperiod main_sessionperiod_session_id_1e0c2ed1_fk_main_session_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionperiod
    ADD CONSTRAINT main_sessionperiod_session_id_1e0c2ed1_fk_main_session_id FOREIGN KEY (session_id) REFERENCES public.main_session(id) DEFERRABLE INITIALLY DEFERRED;
 v   ALTER TABLE ONLY public.main_sessionperiod DROP CONSTRAINT main_sessionperiod_session_id_1e0c2ed1_fk_main_session_id;
       public          dbadmin    false    235    231    3109            u           2606    37852 P   main_sessionplayer main_sessionplayer_parameter_set_player_c5656d27_fk_main_para    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionplayer
    ADD CONSTRAINT main_sessionplayer_parameter_set_player_c5656d27_fk_main_para FOREIGN KEY (parameter_set_player_id) REFERENCES public.main_parametersetplayer(id) DEFERRABLE INITIALLY DEFERRED;
 z   ALTER TABLE ONLY public.main_sessionplayer DROP CONSTRAINT main_sessionplayer_parameter_set_player_c5656d27_fk_main_para;
       public          dbadmin    false    237    3102    229            v           2606    37857 L   main_sessionplayer main_sessionplayer_session_id_8dd9114b_fk_main_session_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionplayer
    ADD CONSTRAINT main_sessionplayer_session_id_8dd9114b_fk_main_session_id FOREIGN KEY (session_id) REFERENCES public.main_session(id) DEFERRABLE INITIALLY DEFERRED;
 v   ALTER TABLE ONLY public.main_sessionplayer DROP CONSTRAINT main_sessionplayer_session_id_8dd9114b_fk_main_session_id;
       public          dbadmin    false    3109    237    231            w           2606    37882 U   main_sessionplayerperiod main_sessionplayerpe_session_period_id_7c1e4dad_fk_main_sess    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionplayerperiod
    ADD CONSTRAINT main_sessionplayerpe_session_period_id_7c1e4dad_fk_main_sess FOREIGN KEY (session_period_id) REFERENCES public.main_sessionperiod(id) DEFERRABLE INITIALLY DEFERRED;
    ALTER TABLE ONLY public.main_sessionplayerperiod DROP CONSTRAINT main_sessionplayerpe_session_period_id_7c1e4dad_fk_main_sess;
       public          dbadmin    false    3117    239    235            x           2606    37887 U   main_sessionplayerperiod main_sessionplayerpe_session_player_id_8b774212_fk_main_sess    FK CONSTRAINT     �   ALTER TABLE ONLY public.main_sessionplayerperiod
    ADD CONSTRAINT main_sessionplayerpe_session_player_id_8b774212_fk_main_sess FOREIGN KEY (session_player_id) REFERENCES public.main_sessionplayer(id) DEFERRABLE INITIALLY DEFERRED;
    ALTER TABLE ONLY public.main_sessionplayerperiod DROP CONSTRAINT main_sessionplayerpe_session_player_id_8b774212_fk_main_sess;
       public          dbadmin    false    239    3123    237                  x������ � �      
      x������ � �         3  x�}�͎�8���)x�Q����Lf�D���z�M���T3��t�~��ھ_׮�>�}N�L��C?�������:��0O�����a@Fuy駛�B;����^ը��֎ame�?��*������2�ݳ�4�{s�`�*�ؑS��h�7o,�������%+����B���0{[��{� ���"l�fg;Y��/�i˷���*� ��!+l� CD_c_=�#�&�<��]�={׫�W�6�ᓐ-64���:�1�����`-��+/���'5���K�K/��u��� �8R�� $�7�� D77�cA���Ӻ-o�MΟ�������EA�u ��!w?Ào �!L����j��c�Um�<�rX$�a(�Jb�8��
>�e�Q���~�_��˚u���(�#G����<oD�Z���F����;5�t/Q�{��������X���k�:1�p��%� �w݆RFA�fFTE2��T�/���Dt|���(�c�S��%R�yґ�Бy���P�z����d�]�Oj�k&Kl�nE}b,"�:u�d�"��vP�G���2N�"I��+6�'I ��$:$�a�x�$��H⿀:侅6�\:�B�ΈV��
�)�qnG�T�/�n�&ή�l�)$w(����Ԏ�2[�J&vl�ג��������I{
��hH1
R�D
���A�j����Z��6�	�ψ�0W�?��s�|�B	�q� �� f���iB@�&��#�9@�8'�_�m�����������̯���'�3��������_YǦ���q̊�d�K�����L^�>8S8��j��yQN�Չ��lńW�&�ӣLP��餞f�ݦ�z6
d�H�W�,��-�(�;%�S:1�~�N�V`r��Tr�G�=ͼ���m�U6�׽�����Ut�KKb�������g�$n�}�U'�
{K�k�vs����ۏ��Ec5y�_���H�q��߃��8��o �j2�#��e�oU�e�S�綩׻&��n'�}��S�U���Uf����Z�]`v	\l��e��!~��#�         �   x�m�K�@E��pᢈ�q|BaQYAe	���:���_�E��]��=ݎ<���D�$>��LSְ���΍
��:Lrn�ZW���M�.]�l�zw�p���������}D��.�]��X��ia]J��u P�2�,�D����Yf�͢8.�9�Ila�^��i#!_�!b�R����]�˂ �o�?�            x������ � �            x������ � �           x��Y�n7}���У�^��E��)�����4(d{m˵�t%�)��{�\EZq%ՑvSX2�k�9��\HP!�(N�+
e���*�A�.棛q:},�����������/v GXC 0�@(�-0�`!��I9�({u7��������?��&�y�t5O'�|t[_���򾼚��b|���3~|?�#���������|�!*�Y	Z*6*��� ���J\��%TL;/�Y[�K���Y�_/��B���+�O�9I�)a� ���	�J���j8	�i����dL?[4^ZJ\�sq�0���ֵֹ�i��<=^�PV�����m����A���A�������A �đkG���ke�� 
Z��������~<�.?u쵽�����/���v�~hڹ�����`Y��_��P  �[���}���z3��׭tȡmA(=�\!��᫗�ltY>t�vݠ�ܬ#�ܭ���ݨ��X[��Z\�$��}q��7 9v(PIG���5���������OILT�_O㊩��lVȑ�xoh��m��f���t�S�-/����y�_�<?����[=����_�<��<��r��ܾy���E�����ZF��Y��=�:�hm�S�WZ(U����� z��@�u:i���XV�)�eΖS���m׿Y��R������G��Nݓ��+[����y���Ҹw���mslO]�<�mx&v�&Ëx悈��xE�b�r�y���]ȱ�PN�joTk�\�4�1ij�zZ��n���de�h��o�ٜ�5I���|`I�$MJ��m	I�hJ�ZDGZ��R��K"���m��N'J�'�h,�R·$��w���� ��lS�D���9. �T� X�����g�=׷q1H�����V�5ޚC���x;g
�a��+�Es���quu7)�oG�y5}�I�˸b�N	�3����C�H	JsA���b�M������秪*'˱�b��|1�S�5W�t%���rx����zͺ�Ӳ*Y��'D+���b�D)�� Y5m�]�eA:->���+q�ڵ��Ѣ��1��nβ�s�H*9��M�@�L���@1�yb�9� M���԰ݛE�?�S!l�1fsx��R��Trd���6��W�:���D���8Nw{§�e�-n|K��o�Ʒ�Ʉ��@�F����/�k2;6J��K�Z��2��cx���^;8>>�˿������w�Y3�5䔆����E��uωM�x��I
��@fWpu۷մ�B�`H���!�\SM�˞*|l��.�������         �   x�m�Kn� D��a���K6��n��!�X�cv��.QR�H��%�1�j�cI0��f���10�	�� � |�i;�Yxm�XХ9�K�m �������n�&��G�L O�Q]����k*U��(r�͵��3�qO_ީC7ǹ��E�0�g_%�M�
�ڹ���T��!�5���[;J��mj8*w�����w�Դ�4*�O45ܫx���:�%m����� � e�̺         �  x����n�8�'O������"=�c+�Z��Jr.o�CRǲҸ@QI���3s$������O���RP��vjCw�
�Q�G�`*���d�Q���qz�i ���.lw���%�����K������Yͮkj~~_��v����sf�3���a3���~��K�y��W`�U: Y��\x����:��އ]��B4:�I������v�8�-���.|�]�����ҥ�eDyA�u��f��G��|��R
��R�_i;�aZ/�V�R�aP�0_]�X��Ov��/]���b����Aʛ�^Ǣ}!o2�O7o�-t�6L�0��o���]3��囋���H�-8�Z�ʬ-y���T^��&�'����5�^��x�	CJ{�;����x�5�a�?>�(r�>N�I� r�z��v��X�ٲ���X�7�	_Z�kZR���&�hs��������?�a\7f�&��D%,]��{���ڷX��k��!��� a����t��'��K[������73�g_ 
��]g9���"ja�S�f@�����k��Yo�eI����y����Qq�$�F�.k<�������E] �<@Y)�@e���u�
�/�2�6����� ���@&��0���NּMKK"Y��L�,])��9���/|����}zQ�_cc���A��\Ἓ����YW$t��q������:uQ:�Uz��t�����%f;kQ:�w'=>�j6ө_�cb���.+��+��� ���ֈ�+�*d��)h�=e��J܀g�8�Zڂй���pk����*����Z�{�/�]ϭ���a�^R?*b�Gw#FM�U�R��#(W���do�M~��'T�ȡᄰor��Zn^g��(n�
oA����	a��^���jo�RO++c�{D/��*���z�n[�S�.���PE���SI����3����!GĶ�^�)Q�8bj�mDb#\�h��]�����D^ͣ��6d�
K�e�?�m�H'K{j޸'�j4�"H �TΩ$A:i]�mb{�#��'D(��:' W���|���G����;�� ["oT<�~����S�f�U6ߧ� ����8M��� ���$!E�Z-��<x��<�Od=�x��:�&���ݮr�� �r��9��,!���]�4����������񜔜��z&����N�C�qk�of�������AQ�J<�u��F��Zo��a�_���i�$KD�R<XQ6e#��1%�1.���b
0��yص���6�c��u�8S&�(]/S�Lb�jw!r<4�Rꠒ��)�����#�H]/���Є��s���~�y�"u��1����-�uyi�x��q��-�l{�������$�D����T��Ta�Qʢ���e���S�9������6�gri���e|z]w��-���G����ZQ;]v��ⶨ1S0Rb��!'^+b�K�?�ahO�\,7<�\ބ(���&�[Y��F���-<'��+�&����o�4�ߒ>�gb,�unn�/�r|ʟVD��x�v�m�ײLf���1
 �C41D����r�Y�Y��8C�u�b���5cTMKA��va��9��Hᬁ�ge�*��3���Y��Q_+�
�ku/MGe��B�1����!� kE��1�1js�͋]��
� Q�U�'Q�����xӥ2ʹ��{S��4+�(���@��L�Co�U@T ��j�DنVw�'u]qI�>�+'�7&~�xn�&}�
����c}�7�N�v�y�}���y���U�+ɇ�������E�            x�ݛɮ�ʒ���>ř���q�N�h���`0*	����O_���^UWG���#F���?�h�Q�y#���-.5�q"�,��_{ө� <������bu���n�b�>��|�+U�_,�[��L3�j.{��F�P�Q��͎N��*���cuu�C��|q����2���G����')���������ӣqS^�l�U�j���⥕;>���a</+�����n7��
�Z��s��OD>���խ�0/0;����0)v}-j��tu��nE���ԕz3_�,��K�r���r�j�1�c ��`�	O�� �wn�F:��Ȉ��b��A�g���fp-?4/Ǘ/y�k�d��y���C|a�"�� ��f/0ό�����$w��.��*�f���'0����4��V��P	���ib߃e�k\j����+V��w�j:3�il�g	�y��S��M���<^��Q�}�����Yf:aʞ7�Hv��8!�"��z�LUE1�C&/�kfg��N�l��?~����g�ob�)�s�1��� t:rҢJk�Or��Ď�r#�Y�?��FOô�K�s��V������j��=�u�1���M�	��g?�*���w���5_�}Q9q�&�xU���r*��!'�s��y��OY[ݸ{S^W+�;r]$Ch��������MQqA ,G��<6��$�K��"�\=�ڜ3Q4 1Ϫ�U�ѫ�2��K�J��t�j�)��U�������M�1Y:��'�X�G0H���J�������u�?XÛ�6\��Ӳ��;��=�]�����(.�we*�Y�����?!7�E�G�	���6�B�䔇UPg�l�: ��&-E\<$��C:%���5��˖2W3�nr���iu��_2F��r�	�'�,�o��,�;��r�)�q۠R� ��wa�{H�-#y����:����(Z�x$^xK�4�2���w��tB?"fb��3֑S������%t�L� K�����-�تv�ӛV�/[>l���+���].L�ο������+D�&H�F{+��g�Ҁ�r�T(�;�`Լ]��r�يr:=c��IW���w{�5��kI�Z���ݹx/���V1Ȏ�b�! ����¤㫁�<�G%3��q˚�z�p��E1s�������tԓ-��SM�tK�s����N}�]�X{V�b�|̘ 1'���al�1��_�x�"1kg���2En�+��$�ώ9ݴ�T�E��X�Dk���3{�ך�L��{��@�M��� ��b��O��: =0��KIQ~C�1�M��\������^\0|Y����S��ki�Ho�.��N������P~��	�H��C��1�Ku��ǎ��v���MKRe�Y��G��G�X��W��,}��{�	q�Ur�_�;P�gL=k���Al���� ��l!��ʳ#7�3��j|��:������f��X�ZƇ72I��q�������L�j&����ҕ~xp�719�l�����bu�N�;��B��^j���Z��gxz�<�FX3�l<����+����ά2��w�����e}��%��^�Vi��5FwGb��5Dg���Uw�P=��)kĊ�����:0����>���71>nL	?�1G?2fz)���iq�$�"ߎ�U�����/`����g8U�sy)���|��ߜ��sd�=�JJ��˘͏��v0��y<����a��lgm�3��,�E5ڡ����v���s�g�x��-��b<�Gc���u�s���o�hjLq�^��m]ם����^f��M� �K�e>��-�2Xnot�(O�*��yL�DM��n7�z�O�?}4*��{�3��r_�t����h38��`>ՑSt7DI�4C�AWWIZ%�k��B�`�f�V1Fj���˩ʒ<:�c8ka�#Zi ԭ���1 |Y~B�X �v��m�VGݪ������@�t���ĺ������V�^?ON��<��mt��W�����xG���1v�Na���O���!l+ݪ��æ�i˹ad�B�`�' �������_�[x�z͙�{�I���k�_=&��7��ȇ��Ȅ 	�S3+�z�z��p�/ 猶�k����'6� ��S�*�J�v�4�	nNR{vk��1M�~ίB�	��ț;<��_3P��2p�"�Uo�m7������ظ�Ąk3��� �{���\]�
�7Xc�c�p�Θ�h?��ob�{��wV���D>3��*;���������ʀ�(p]Մ��gn�3�H�������Kq��J}ή��i�)�eE6���Tb��y;Y
ѯ���+
j�|Y�Q�\l����͚�?�/���f��$xl�B�:�������Z�kx_y}N����.���?�(Kׯ�I/�W3/!=-���3g=�#Ej�l2�a�+<����pف�a��Cw9'Ӽ8�o����pQ���;L���u�嫀=��BEƢ#L�u{! ���y�UU�>/A5tn��J[��pO@�߼Ї�'-'~M��vz��nT�*�Z�|s^ɇ���e���y�df�֊����A�������X�u�^�]��x��ܰ=��N:wo�B����ɖ������_CN�N����M�СA�R�����m��37��?����QL�]�vrK��Ƶ��7��.*�4^���S�oZd����[!&�xU:ͩ�fvRѡvZ�7���J!��ϫ�$�o�}�Y"�i���x`[�����
W+�p��$��&�������a�k��W��&�&K-�q�P:q����Lx�����nu*6�{^-��*����T��ՙ�w�u�Œ`
�y��Y4~&��S�S����"q��*���$�*L�?�Wo,�b,L2X��I�̑��) �p�����Ya`��h��n߼>�s��r����D�}�&WS/�����M>.�ı���?�WH֋
v�<��n�ʰ��Ew#^��A�7Ζ��ྈf8�ŋc z�#Fo^����I��I0�f��oؐ����x\P��
��Ӻ)4�X�+C�l)s���YK�1����R���Bo\����Z�� �ZwH�=`>C���Y�����U�s�{8>Շ��<=�E�J��>��4pf�e�E�{���p�y�~clk�������N�f��l�}��j�P�ϲ�����YOY��2z]Oig��i�M0{Y�eV�&=D�j�n0I�����{Y��0�_�En����s��b�5Z7m �d,p�	���y�5��N�HT[���(Z���+��1�9��z�>����^���|� "��J���,��1L�(�	�tX��(w���ۉ|#�(+6:�x]O�u�nx:_��D���哩+�;/�͋|f�Є �>[���
Z_0�!��1@�7d�� ���W��(my����'���:d��u��i�>�ޮ�|���2�/��/��ޏ�	�~�K��*� ��t=_ ��\�l����?�~�� E�}��J���<�c�̴�\9H ���7�a!NO��޿����d�G9�_MfM��Y䳮!�a��ہ�{�X�y��'F�nw-��C`�*�e8�l3]��k�����Nl��"�.��AE�b��Hh���7���~OU	 �?/E��bq��)��4/�� [��z�%A���� g{p].wǹ�7o��%+ʶ���tSg�k���~��D�V�6D2$t�V5�*��l	�%�{����z�@/k���	`1��S���nX��7%�k!7b��Cl�U���C�^l]eW�;��{�>�������7�v�Cږ�f)I�q<�߸��a��	Oy�5|k�dl�uf;�J�Y9��ư*�� k���R����^2��>J)w�,\�z_ͅ[�]t���?xA$a�~�vx]�s4��r6��b�0���r�9[�񼺻�޺�=f쾫��R�ڴU������v�R+�� ��t���O-� �  P�Y �:˱HH��7�T	�
;���ў��͋�?�]�`���&����U�l� ����������j�H��E�'���)���nyj�boh�[N6��Y�	���m��������{���]X�j��lz�]��>h2��Ԭ��;8��}
�[��bsfh�K7wv���pD�K�F�s�9j!w�!�ˋz���=/ɣ�`s�[c��������	�@�%K�8��&Ut_����c ���~��#�7�k��C�*�r}|3�l��S�ϚD	�	qX�������G�ʏ�0����u̾��̇)uai�� %W�O}�L:��P�*���,7Q��[Ԟq<�v���	��}��:�{�̞�B����N᝙���W�,�&%�:�ҰnR�iɓB�9��?~�P��|)�;>��9���֡��갖��j^�Y���8`��7/�6��{�%�/��&qrCP����g��D��؄b��y����'� �O�^��yp��s欠������r�j� �%�������GvB	��F�$�U��= e�j�Ed��Ӕ�]��+e!K���|�����qgǨ0O,Z�F���<nW�|~��?�C�[���W�H ���Bı��@��dm�T�����z6)�話+���G�L���2��[���Φ�#[�fLˏc��|�Q��C��Oy4�������Щ�2�ھ��A:�x\�i�z+]��0�,�(�}c�[��n�T[_��\6��-�qѿ ���5���h��U����1��t��s'!y���gZ��~%���T�9ʝa0�cr�k��6I_�r�||���v���sދ�Oۏ�憎?����L6,�l��R���ƩR��(@������b�YU����n7��]jv����&��Ηx���X�_�9B�{�S�E�`�}>)����'Yg�YR���d۶���0�G��\;��
�6������#�ڹ|s)L��;k�Yw=ͻ3w�߼�;Ə�b������04@]��w��sCߴ�
u��W%��_���vo�m�,/y��N1�e[�$YnF�4Ws�P9s7�M�q}�ˉO �Я��P��m��H@=�����.G�
����Q�|�"�{-2�f��}}�C�@���I�r��2o.�i��j����B�/ ?�!�	�����i�@�3�,\�na�ڨ�ki��+k�a�D��)SE����7��_r�K�p����iQ�D!���� #;viz�A�y��u��ǫW	�ۃx�df�y�L�4H��{�!�ai�<�hې=G�}}�ۿK!�8�����"����F�Y��Em�>Ŧpυ���w�%�L�"��e�,FcL�����>���]�GV���-�K�l���>�-g?3B@ ���ߓ����H&��         f   x�-ɻ� @���݀mmEavwuqP'Q�?jt<���a�L�-�J{������9�5�?R�gE@d����Xaq\c`. ���R0(�%�wBH��{���'c�      @   V   x�3�,.M�JM.�/.ILO�)�12Rs
�DQ���~������������������������������NYc��!W� O,�         �   x����
�P���B��4�sPO�3m��<eP&��O4�,�E��g��/m�Uqp лk��E�y�12�hB��"k�%RBz��mE>?��ٗ�y=ĳz�5˗`��vU���u�����wPt��߆r?��|7�C�50YDK��lb�L�!�~KX��x)���C_AЌ�f��h>��O��Jb%R��xyb	�febDMx��}�B�w         J   x��1�0��x��C�D�bk����v�}��j��W��l�;�MW�27[e��m�f��c�@b��D�kX4      !   H  x�u��N�0���S,9p����D���R�8�ræ�p�`o�=H��7���Ļ�\�[A��m�w�b�X-Q{R�Lrm)?���+��e�[�@_;4�EEau�ʬ���ޛ���3B�z+H���Z0 A�`����lʀu6���@[@�l���a#Y�e���P�	�?]EĪ���uQ���b����Xmlw	��&��������Y��p�� g{��ZZ�S��"V�,8�X~i�2!�?:u-4�je�D-:�=�A���xi���8%cH�|��qN����CJ�Qr�Ki��/�l�N��N�W����7#��      #   	  x��_w�8Ưɧ����DH��k����tvwz����!6N�bH1n����ҋm^!p&a�=��IR�I���}\f9%Ve--F�>�bB���!� ��QE3L�� d�<ߣ��������6�[��ƞ������L�ky����2�X����E<]�����,��C������t1'�|2��u��E"��Wq�N���zS~M�,�?���C��}Qf��>]T��AJ䗼������8���͉�}]&��(K��.Tݻ�L�E4/6y%�9�Fo���V��u�ۊ���p�,�t��ۏZ��,�/�$�?�v��4_W�f^�E���v̨,���$S�y2���j#-�]�yQdѢ��-�y�U�5��w	T�r[L��*)��2�o�TO��-�#�j���*>'�:��^�Q[��Q&�"ϓmQ�Ja@a��2^%���CG�q���ѽf <hzY(�0�hN��~6jk��U�P�����������MYl��>yӧ�\�R}�\&I�.�
Ux�m�Y9�+��qU�7�>*�������C[���1�^?�����e�^��W�s�KR�Z�RX�S�p_��?�	��ǳ����jSB��2]�$�����,�X�g�ɖ4�U:O� <����PO��䋨Ja`���Ye�����3������Ǥ�uP�A/���v�f��T�ܻ7����Ar!+�zl��ީ���(߬��r+Y��dI��2%�z.��刖��'�a�p,��l�@���$=� =�f=nKϻ����xX�g������z|��7���r'��XO`��^��Iz�~=>Az|b��׳�����=��>�FλK�:�:9� 9�aF9�٢�$=���a:��Q��?���h �}h�5+j���`���s��6��s����1�}aT��uOS4��>��iV��EH�cR��Q��DT�j����1��CVo�-���A�K���0�bV��5���:���Y�H:d$`v���Im"1��%��0��GRIL�m���0��,I�$��A� n����^�Ln���0�a���ӑ� ���J�6]��*��!��� 簁�,�]t�&]u�����eV���d�Wi����'u9yoJ3�Cc(!����(I�]/��θL=��O��&��(��OxЮU�@~P��<�����>%5/VwY�M�4	����(n�D����ə�(0����ZtSE.'��%d;��T���l��:��h�@H�4��3B���$����p̄����Gإac�����T�5�/N[�nY6��O߬��i�!�\D��&Z����J��ud�o����-,���e��QG�_vY]wF،r��u��1�q��QbיW!tI��Rʙ`�T����w�&g��Ww���*�i�]~��f�T6�D�۸:�p�y�ux�z���rӑy�s�.�ڈ��_)��,�J�:�	���<[��O��,�)[j�V3����yح���Yxo���~�� @�IU��I-ƁG5�v��?G�f��H�+OU:c̢�a�٪��H�B��$p\J$qɬ	a!sC��>u���l:v�heߡ�D۴����1�t�S�b�8�$���&=���l&z�(8�M��y�jb��`c=�l����w����������&�"%��`�o61W`9f7���&�zXN����fs}��l��`617�z�f�f�+�l��`61N�j���f����̨g��q�1�)/o61�b9f'e��qLg�c��a61���F�(f���l��b61�)��F�(f��<0+�l�� E��b61�Y-z��1�&&0�E��2�����Q�0����=6�(f�ڢ�F�lbc[��(��ML`n�G�f��7K�?0�:>����M��DIn���s����L+�j��i�Z!��PX�!T�������^8h���Sp��C�Ӱ5�n   X�Y�:C2��3�Mn����=�Q��M��THܐ���u�#��=�Q�&�'�_��W��E��ZZZOt�(בF(�0/���9��LklS��s="�aI�jl�����~ac;�g .q<��3J��rn��둝���(��A��S���
�W{O�`(�Ʋ�;P�� �'p���>��^��I�]��u*iM�ѩ>�(��A~/�ѭ�D~:*�'
���OM�\S����;�4ה
l���΀�\�7o޾�HZ����<�����LS_O3M��?!�M�v2N�zWr��'x���&���;�o�qXYr>���d(�(���n�e?��>;;����      :   �   x����
1D��+n/	��jm��Rn��%�U�߸*X���0�Ա�;�Z!��g|��/�Z'��ۼ���R׹OpR�Q<Cl�SF�"��g�m�����A�Fu��ۍi�	�gIY�E�������/ʺX��2�8      <      x������ � �      B      x�3�4�447����� x�      >   {   x���=
�0��:��`#K�\� !�C!�.-�9~~<g����������C��lۂk�����]ǥ���8��.��hC*�WD�.5%�SA���RG�-��Ga���RS֦ _�3Y      8   �   x�u�1O�0��9��Q+����Y`B���lB���S�Z�f~?=�������mn�G���UeRq�tGԭ&?գ�����u��t�\E+�䬹�M�W�D�Rc
��s;�	J�.".�"9����.��k����Q��y�:uN���t����9�ޢ�j���x���xcvU�a�R��>�`h��g����5�+)�
�7��9�) �.���+�:��*�~�      4   q   x�u�+�0�a�=�yek�����0,
(*h�F&�*��4����>��u>�#qb�Z$�ha)��=����n~�R+�"�E�G�W6�K��W����[�m�-���ϥB[%�f6"�      %     x��XKv�H\ӧ�~���o@;��9A��(�eR訝EhU@�.�/H/ �8.,�W� �OUT$�O�������a�W˿����	��1L�H,�o���5	��3�op2Z�.���g�ǅ�UG�������ק����H��|�/4������i�7���+�aW�X�L������W�S��`X/���ބ�X�(̕�$5qBPi�!ō�M������eE�o�#�I�!�[��z�����/ 4i�I��n|.�͎�x|��M��A�E��<\�<�$�QS'��-� �-�5?G�Cǚ:�[�< hܘ�t_��r�c{͜5��c�`YM7斟s��vR)�Q	iW�c��R]3</��@Ꮻ�{+��
���������cR�KjD��z[�L�e���Q�]�x�}�LKj�Y|���?��
*��|Vl��<՛�ܜlO~�]\���-�1M�q=���w���z�^���.�̏#�އ��P���m�2Ö9gҠS�<�d`�܈��r������1�D����o�W�;��(�5zPڒ�爿sb�[ �<�����y=G���y�Gs�hC+���1�z����nm��n׶)a��n�#�>��##+�^�����Z��s�߷Y�S_���L�c=��nN�Pե-[J,��t�-`���ٟ�I0����G]�i��]��a���_y�� ��hi��s��L�_o�\�_�s��g�Nq���p��Ƣ���F�L�-t=I��.Vw�p���;B��r�B�l����M,bm(:�3�m��:��L�GV�^Ø.Pe���5W�_LV˓j������k��)գhE�����4Y�޷ܟ��a�W����_�B��Z;�q�ѳm���B���=�I}C�[<�"��|����4��������S������Y��ڕ7����������ډIk�E��9�M�����[�&4r��9���.d5��:�1��|� ���gm�ҫ�c���r����ߧܟ�!���z������>F��      6   _   x�u�1�0��zE��I)r�����h�Nځ\�l�v�O5Aީ�88ˣ��̵�o,j���j���x]�`����3��:��*����      D   :   x�3�,���4202�50�54V04�2��24�3017�0�60�%ka`�5����� W�      '      x��]M���>S���C��j��_I�\rI��8�����C/�+rCre+.�����n���Z��S)����Ls���< �f'��AZ\���EX�b\x�nA6�"���bc{�_v9�M�����(_�¢[��"�W�*�6��m��ݽ�{�ڿ����t��������U�;]>{z������|ѷ7��<�}��?����ݩ�������ݏW�K�u���t�?���\7�/�7�~����t�;^=}��䳗�Sw��?=��^�v�Ň����n���w�����z��{1����T��>&5^���~�[��0��~�۟�Ǜ�0����f�Ϸ��u��fX��M�����?������j�;u����8�w�����|ֿ궷/�Z�<��|�?�v��v���A�.�}���w'b1��
�ep oj&����"�G��)���~�8��wǋ��/�~3�8��?������Ͽ�lw����7���8��;���������^|�<R|�)?��:��ix�/��e���~���~����?�̮�)���0,_�����׈/��/�������ޯǫ���u&~�w�y���H���w7��<�?�y�Vg��uv��W��vu��u��1����L1�V+�v6�z���1�Kӻ�$r�*�]�wh�}?������������z�����_Ǉ����[w3��ׇeX��MZ�袣E��үW)���s�e�_�X�|Q���[�6��1�������6"ѕu�����Qe����ʀ��2�>�s�oDh���n�\ׇ�Y)��r�閫���̪�_9B�f�<E���[�|�.t	R7�����o� ~j���a�=�� ��b�[�<�s��ߚ_�j=(�n��0,hm�"�r�9�^mL��f����߶���e� ���~w)�r���~�!�H�x��|�l�),W)��^_ڵ]�5�;�������?��ׯ_o�. �f>��c6kd�=�q�]޹���6�����nm�qa��g�[@�>k����8;�o{���w޽ك3��2�ʹ|Ґ����<a�q{��v��5!��a�?�N?��\t��cw���b�n���S���9�Dc�}7����aW�j�R���p�P58��#sȪ�& ����H��Z0u$<�t�y����U�8�#A����H�R��L���HQ7; *�D>�GJ:��˂�\�$�z����P���|��ޏ#�d� ���?�Nʝ�*	F���#��a3�9(=���!��t�)�-C�B:IGo�T%�t�m�)���:I�X7_p���NгCX
 ��:A���>0��P'�>P� ��:AY��C9>at����+�K�t���C`�:AO1����iJ�ҽ�*���C��c4T�,	:I��OL��[���/纭�Nг�5��Ϥ���H'�ƆU�-hB5�%�:9�&֑�F���y2�,:y��	:��,~:A���v�t����Ϣ���te��������F�B:Q�vF5Ί�A:YG�U�-oR*u��>�"�P:aO֊���!����P���d�B,�&�:� :YO��eAi�W�8�AJ:I'�U+�4�>��ӱ:��dtJ�NX������Z݈�N���N҉��q|}N'���A8�?��tgl5���qJ�4�wUU�g9��}�~�M~��tT�3���;��g,
4�j��d=�Pd�Z��W�u��`�e�k/�������N)�����Z�����Q�u�Е�G���Rʺ�*
����d�E�T�蕲n��h�'���(q*b�1(��T�1 h��:f�<UdaJ�U�4���H:QG/v���Ӊ�s��6&�R�=�TW�x/e ������R`���!+��gU4Lb�4(e���&��Ԇ`�,�GDT�`L]*�6Zԉ��u����P:Y�tFd'7�d=��Y�R*�,�e�cY+��G[�x�g�8�N֭	甡t����PhT�뮚��EJ:Q���}�,ǡ���:�g�t��bu܀x/'���z�G���2
+�1(�q(�c�����R)�:���M�t�)V"���2���LJ�W'	` $ǀ#kv-ZZ��M�dޑ���.;���o�K!����u�����f4 �)U�/�_�H�@vr�/uP�_Ѥ��e߽>��J�]Z:p�˛-(�Ro�l@'-\Zc��JO�:U�lV�P����RwjK�X�6���b2Aۂ�&�E�q�piBW��"w�غ�9(�%^�N�C�$=��-[�(�/E[��췅&��&b�b^꒩fq>&Z S���ڐ� S�P�U�Q#�9	�0MV ��G%bjRK�2f"��Z0S+��@��J��}@%hZ�nt����)dZ��2��X$��M�i�X՞!��VK=�	Z �h�C��%fj�pǐ��3u���Ԇ����^�k�L)�D���Pb�6��:�2A����,�4E3y������Af�K�X�)QS'H�mM';0��M��ՋG��T��T�ʪ+QS/R�wPj������T4%jP�U�0�6M���.%l
�����Z鄝D�I-����.��i��&��&�4V�s��itH�7�4�4A��;U��ٜ��/k���A��,���¦F�>�zA	�fQ�W�u�Ah���6�Vul����M�L�>�o�M��o��J���=�6��:V�Jؔ�rp={\J�+�9��4ͮm���Ԃ���Y��F%d��<�Ȕ���0E�&DjLm=�l`�-��F&E)S'z8� �!
e
L�L��J���0�0��� S�+� Φ&�T��y#k!S��ӄ�2%2���L�$)�8�JȔ�Ȑ4%d:�婈IJ�Bń�U�-�)����l��L-ռ
,��4�$�B`dK	����e�T	�z��jv?������>�J�|<k��Q�|T&%YIt+\\e,��k�ؔc��J<��0�h+	�;oZ����Lh�Ul���YL-�i��.�%f���L���3��le%f�XɄ \W��)�fE+8�%*aSg�:#��
J�t ��S�i��1�j��0+�5�1�thM��6LI��b��Uk(��L#��gKM����x�kJ1E��{�+!S��T�
�)�RS_%���$�f��2�r��a*�2_é��\�	՚��Մ���S[ S� L�@}d�`�z��F%d�H·2��r���ºT"��L(��)�Ԧ	р}@%d� 
��7%d�O�	;��@�Ab��Y�J�4�qk<� �>M(�`ZS	���P-��9�DK���P��(�R�$C1�-`i���,�,%'q/υw�`�7IR�9��DK�&ȹoAK���d����h����	-�Tv�-�Y�%�S'�TJ�(�Rt�,�2�R�g���ϒ��H�9N�Q��n�dZ��J�4B=���`�p���mJ��O�dPS�iK��&�4H�bM��`��+u4I�dIWb��$���JI(�%گ�J�HՕ*t!m����@�t!%Tjm-��{P"���>M�DR"��%�l%RR��j9%R�2�ɰzQ"��]�G�:���B�!J�4�$�Cl�+�R�Tu���*���M�zcV��P�g�-A�4�V��b��㐂-%Y)M٥��R���J��ptE	�T���>�T�,V�J��R����Tb�Qqv)}V��񃩀vJ�I��)J���J�ĚX	�:��bEMPi�b������J�Lj�.�$٥�EA����V@[V]�F��Vt�)9I#{�J�4��j^��Q���L͸"�6��~cJ-WeR��$�R�N'�`&�M�(�$L�2*'�#Cʨ�K5�ړ
�P(�J��r�l4-8)H���+�R�Z��aS%�i|��R�+�Q���0��7h�&�$w����J��kJ.�(%W�()�Z'����Ɖ�ɀ��oE��a-H�����nQ��Sz�&�&9��_��,*b>_�`Rk�� �w��I��z��&N`��>(aR�J�X*�ia�	0���IQ�kk�J( 0f��IJ�b^+aR�Df��:���4T�?�R���qp%N�WJRE8���Ic�R��@��Hc�� {  �	'E_c�TF����	(E�����(_�'��+��4���=RB�N8+ַ`�!H( 2j��J��UT�(%V
�j�����^B!�ؖYj吇"�:Yw��-�9J�4�Z��Mu%Rj��@@R��*y&��"J-��3�JӤb�1Mi�vrj�R�V�B�j���k��x�N�����/�5%����P�6��{)���f�0)L��5SR)�ҥ�p2�6�tR��d7*%�%�߳S�JAR� 
�-yT�`��I�V:Oq֐(������F;勵��C���L��]J��I�QvJcL�$Q�<�N�I2���I��D��UV"�ab���CZ�ԋ�P8qڜRW��D6%P+b��[ۄ�J�J!%Njm��O>6��$�H�{�Jc��/��/U��JF�(��t�Ӛ�߈I�ڤR�T���N*��TV]'��K ��O(q�j��3�O	�|�jQN
 4!bpZ��Nȟ��RЫ�����|Ro%	�>�R�QB؂�BD9�K��r�]S	^���L�P��A�8�d��(J��T5��Z:�:@I��m�.�[��ȑg��'�L� ���$ώ���땒�Z*�(ҬmBI%�ma/�FB#5�J>�=�$�4:������[�jqR@�G,�e�.i�wW� U�m*=�\ +Y��� J��E)9�J%N&4!�(%i��)� �*Y�JfRi�'�v-_�$�(�R i�-Hi��#@ۄ�f�����8�)M���%�]��bp�j�!���S�M۴4���mPꍑ��Ԃ�zi�d#�J��ĩJ�m�R���&�@�5�0�4BR'���֝o�[�tG(m�Hi�T
�	)�S/���m���\|B�P��{9J�4� �(99U	�N�߁�j��Xi`KMmR��'�\�D�U*=�����R��5��[���J�4M�Sdk]	�:;���[�R���_��k;�
jN� dJI�2��Z�ҀV�|��&��^�U*�RW�(����`��DI�M�K�^{u2-U������&�J�4x)��6��OZ�q	W%Z꜄t"Ǵh)��bi���M+4o��ƥqR:�dh�JSeŦ�.�N�U�%T[�7NzL�&��&}�K�Ymό � �Ʃ.M���6��D��I�(��1ʑF%`�IʅG����)
vG�J��4)��f�� 牽\%^��eK�%^�C
km�RSE�J� %b�$s�J"�1/o�yJ�4H�}2{՚�R㻬�1��yI%�B���t;LM��ar@�T�7&/&�J�4�DB[j���w�n)S+u�l)���L�4�E�M�K��>�c�6.5Ս�%�M��n<Q�,��u)GBČ(%l���	M��0I���tRZ����^oJ�N�1U�a�σ�Q�~�y:�����n{�9�f���_�v����ݺ;��סA� \���s�6� q����U���O���]��r���7~;܈W�.=A��������)_f�c}�ʷ�eV�y��}���Շ��n��a��eI���v?L���C����Ճ�z�Ǽf|��v��1�n��//��ݿZ�q���_��~�ڿ���O���P��H���#�G��F��d8�5~`$z�H����Fr����k�����5��������n�z��0���2s~{������ow������M#���zY#32�r�݊w��i�8?��~�1`η����+O�7��˾{u=��?����K��Wy�������\��|Qa6�;+D^!j\��+D���^!߶B��
���
��Pl\!x[9�g����>���ƣaT�J��0���'|{ 9S�����'��'�Mw<��w���uv��W��vu�W��cLK=�uK�\�7ރ��+�6v;��j��1�>m�a���3����ÏOf_�����O󿎏5����S��-�V6,C���-��z�Ւ`�"��YoV�%��_d�n��}q��t�4Nfv�m�gw/���f���O��馟�|/�=�{����]���lB���7�����}��������n~���x5��Y7?mO����us��b~s�7�/nN����ӧ�M>{y1�����m7\|�o�_����~������i�b��;�O;|8Lj�����n�<��a���|�?͏7�az�O���|�o9���Ͱ��u?��}d���<��,����<��O����`�ܾ|kM������˚m��j{w�0_�>�n���.L�u0�L��,���ޘ���^!]\f�!8?|
3�Y���?�;6�<�>Jd-������ ι��M�+-�LB�P�-m�����N�������+�2�2X���҉5~���q`���zbAo��Z]4ΓU�B�B`�]�ާ��A3�SR<50��@CM�<�j��T���Tj�(��;'t����3�ۣ��
7E�ȳ�`�m��@��]=�����(䰪���<2��#܆K��A
2F�(9y^p[r^��<�j1�Z8y�MY2]%A��FnG������8�-^"ٕ�fv-��l�KV$��Q��<ռ��eص��8iX�a:Y�	��
SPY<VƓ/����m�.��H�#N�ܛ���	�Ǳ�����9�P��*��n$o�sN���8�P�&N	�/5q����p��^��Q����̤�=��NR��vLRR�\�()y&�A���g'Yɥӭ����fU�HI�KR�:��.#G�Y*��W�.�J�����R��*�xȘJ�fu���:�X�+�x!yqe�쫥�MX��D�K�LZ)�5x�"u@LJ�6x�r�Y��*�ObQ1�CI�Kqr�������[ ����Ń�ո.5��T<��I7J*#i8��rI��[6M�K�&nV±���qVz�)�xa���VR�b�Yn���b=����(�x)JiGˑ m��#0H��˦��5-����I9b`N���(�����W�.A�ʅ��%���U�+�xӐ�+��S�Ο�֧�9��bS����_�B)��m<X)�����&�I;(V�J.�3�9B�&xJ.��ⲕ�R���\C�����$����&I±�ڹ�����J��w�x���-IS�R�E'��H���7�����@�'����4J27Ӗ.!yslҖ.�w,�{�,<�t2au�$�eӺ�ʟ�$�	�j�����e��O����o�u�1��ৄ:�.	��{.���Ľv����
Z<����ПO��(�8N�H|������_�5��eޯ&Ĭ ����e�*ơ-�P��5�e�G�� =r�勬�<jh'z�5ǆw�ى{�˥�y�7�'���@h#��ybi��c�6"R�y�h��3X�m4١K�8�/Bm����6�5<�/B�l��}�^��z�!��?ڼ�����]����Y���YJ�߻R=k�YA+N=�O���_��7[j��,5����K��f[�?���~v��z�l��ǳ������/Uϛm5�x��������y����V�?�߿T;o϶�<[mP�<�߿T=o�����j��|J�߿T=o�����j��|� ���꙳���^���SG��UϜm6�x6�t6�:�?p�z�l��ǳڦ*�s�[�~c�-<��6��g(�֓ܳ��r���G��U�<~"q2O��7����`�3GmϞ��'���O:�t���3���u�{��^�ן���{��^�ן���{��^�7���r�l��\a��#,�%��RO�&Z/Wi����W�-�a��.rk�u>�u�Kܸ~՛�͛����	ξ폧����v��4��2�!.ȧn�������x��YXQ�t���fA6�s;�.�7vu��|H��345?�ߙ��������By�8�s�琮\���JR� %CʦMW.��1'e�~��j��������;�-7=�Ur�+k;���r����ح�=�n}�`�ٛW���'�_>y���l�K�      (      x������ � �      2      x���r%��ǯ�H���.���{��w�K���d*�%i�d]~�ew�cy�?5Q\эjF��d�A ? �T��峿��^}w~wqy�ӛ���]^߽��?�I���a��]�a���ŏ�.�|u���?�y��������������������1�0>���g�������k�2ג��"4���B�J�@%T��b*m���R�`#�}��Tk��ƃ;V�@#U�IF�JǓ��H�[�{�%�#5lvD��ĥ�#uLb-���!�������b>n�0o��ɩ�c$Lƙ��T�p�Iyd���)��<�;9'Pл.U��x�	t�M_&*�$=��Rգ��IzK*S̺昤�h/_͇�GL�9�)�~�g��T{|D�EL�Ke� �1A�C�����0��W**Sc�d�0A/]߾H�<#&�U])j�C�*�6A?޾�	zl�m~Q$��L}�~Hz�$�����,LЇ��&���y+���c#�vKՌ�c�&�%4ih�c(L�{��\H�
t.�Uy~��W�:��]d(L�s�������NU���������P/����3�8S��1Y����'ymT�l���"�P����\U��0&윹�P�kØ�'j��Q���4ٌ"��n&q���1IgN�B?_��hdlb2fP�s���� dP���Y�^�$����ԎǗ1Io�7����1I�!��.{M�!ަ���ʠ�Ҋ�~UL��I:U6�,�C�3&�C�m�Z/���PUR��V(�Z'6��!��k:���N)����9P�^�	��(.��ט���0���@YO�D��<?L�s�դJ6��zhn�U� (���T,�c��nʘH�b����w�D*h�d�J��|���z,n7�$�8L�sn�ۄ*K�	{��V��]�` ���acC���kH�
���T�t�K+(��v�a�J��t_*:���`�-U�a����Ը?
���A���m����	.�rW�b���t�0Yo���8��c(L�S&��P��w�T�6�\�f����1Q/�X�~x��P :�fCQ0����q#�w���^m�o�mu0
�fl
�
tL�?iP�
T�T��?^��I:�f�UTҫ��D.;���9ID�<���QZj�$&�&0��\l�3�����_�^J��{H�u��- �����j�c�4�{N�4�E�Z��4��nI�4���H-/�RNvO�$� �����"N(.��z���Ҝ��)���Z<%�U����-x	�v��S/}	��Z}�i��v2���� .�1۲�c��r�Y /��'zS���b�r"�҃�4&�k��V�x)Ob��
/�=�Y<��`�|�T�0-=z�J:01��I�+��'GnU� 1M�)q_A�5LJ}���f�^Q�Pf�A��������E�Ȕ�
ա��}��2m�L�.+�t�Zl_fZA�-��Q�@f���Eym@f���\���L]�/<�0SnѣLbz��45�Ǯ���MPJ��0�U_���L�eZc��s)��=���6�ܴM�7p��K�4W��#�n
RS&#-��R��R5ޠ%j:����(�h 5�ѵU�0�M��d��)q73;�Za��.Ê�l:=@��K��V27)��M���1H�M[����� 4�>t�NAh:�){~C�`�L�q%�b���>,zĦC�=�K3&�<��E/�ش�d�8H��M�L>sY������dS�Ԕ�����MP�,*Ħ̖�[���i���a��h:\[�^n��L��S�p#�L;Y�#s^A��vm+�4�>%��0M�=�`:,}�^GI��iv=<*� ��<e�S��ђ��	�i����\?PN}	�z~l�"�Ȕ��4Ų�L�=)
��i��bԉ�)WO �b���t���X�2@fJ՘��
3���EM��ib���j��4v7��-�V�v)�g
B��S���hzH)&�-X
f���hFm�,JJ^覹�`,��1r[�1��$�K�̴%K��,����Yda	���g����L�F7�y��6_nͪ�i��g��*�̔��}�Af�%Ip��}�f���%��4'6g�H��M7hgw%�ZcJf�6�`�Ѣ�R�iNf�h��LK6k�ˮ2�F��%���̔�ǋ�R�i���"�p��h����`��{XC��C�ݷ�L�o�$D�T,����s0S͚��LkϞS�V�)y fX�e�f�J�$�"�ξ?�H��R�"ͺ���T*/U��>%�"�N��o���t��Sv@^A��c�Y��Ab:�wk
��ҧB
+���V�&��@EB0 -M��B%�Ҝ�Bql�+��{�ݐ��K9{ܫH���нZ�9 -���yY��%[-Y��&��f��V�hiqh`�q --�,4���d}j������1;YN:�ԇSd�S+C� �W�s�����T�� -md�Ka!K�M��?�m�WZ�.�Tc��RHu��V�P��P41 8Kl+�4�T�)���X��ɞ�R��Y����t��������##IQiJ���� ��a�O��H )��,�T����vcd�$�5Z�9Q/ )��ْ��R�5ↀ�����Cb������NE�[�7m*�mK��{��"��(-��si$l�R��)KH���+Uh��4�[�V�
�tr©t��L��Ú��W���%����;V�	���x��e��F���]����h��_��E��4S��-��V�R/Z��Rߓ���K{uiQ@Ii�l��t�A��y�6�� )%�I�x� (�!zg���,Ԑ��+bӢ��&��&|5/(��x
SaSX ��]���D43�r�%2FՋ���D0��XIS@A|d�^��N��U���APJlJs\��;��7^jś�q��1��i�%LJ^���,ډ�1p�Kť�� �r����OJ��
&m��)� ��kd��;�B�h��ڻ��sz�%JJSM�无����8��%L�R�@�PL�|��W0i͎1�} 1i�N�Q;졘t�����4�S��b/^Ta &��X�yb�R}G�4���v6��*u/`�9�X)/�@*�I[O��C�9ileBmK�4�p�'F[�	��Jc����} �T��{��~�����D���笤��Jk�P@j���f+�Y)M�ڳbe�,O!�m��4�&O*���g�������d})�TIi�V�DK�tlU~Oa����f�}��RYi�v���j��n�bf)�A��r��J^�1��KE��[�%R�
z�r��Iiʖ�JIPҋ�KS�bl��tjC�Ս������│���d�HA0���@0�Ţ��'OI�J�,�>�-��b+����T�,�.��f/>Ni[��-O�ZzW���W��	bҔ�蒸� )����g������9qhMi�ͽK"J���ܦ%N�qF�F 'Mɺ�siKmx{+uoAPںd��6�l#kEJ�gf���>�F�D����}\�?����XW�Z<�#�'@Nګ�$���t˧3;��8)��	��i��Nɟ�t��־TOZ��j�c4E=z@(�0Rj�7w��E-�=1/��M58n���V?�1��-xa sս�!��rbi������-x-%�
|'����4��uv���\��=Qo�on~BZJK��+�b��%h��'��Ӡ��:H�t���u����rR�^���ea���;�������v�z�'�����H 䤹y;�&qp�z��B]"��[�l�l��&��*^Ѐ�:�is"��R�%�d�D~</����G�)&���h�$�}j���� )�5���FJ{�R҆Z�ٳ��
(-!xIT_�ŏTJUH7Jc�8��}��Z����� (M��Ѓ����lj=��sKk���XA��֩�P-K��xL]�9zl�ɓ��ZP����Z�����t�~'����:(�	�hQ��'j���*�3�)���r�돖�Jk2a� � �J��F��AT���	�����V�o��ѓK��sS@$/�~x^��5&g�a�v�U��4��I^f�/��tp�v֞����
�R�c���e����-ߋ�1G�J�t��pii��i�8��R��^ o
  �z�&�Z�xi�.mS�,�@�J{we%�1�KK�Ī$���m��m	��tN��<���Q�0@�q
���-�]�0-�'QX"�S���&��A%����.�����쎋<@`Jޚ4�E+K��y/�Փ��6� yi��S�D+��uֳ�@bڽr��$�T�	J�L�w���5׽Ƿ�:HL�W^��S�Ĕ��þTYZ���6��7a�� �i%�Ե��Rm���n��4yߤ�-6@d����Hi�����1����s���AhZ�����Y�uoG�,Q 6����IK��L4��n:�VH+д�㝪V>c���QP��|l�r{����������]�������/��_]]�ݟ�ị������W�
<^�o}��ש�Jm�����_ޞ��������������������L#���py��f��$��^��x'Wov����ݘ�\y��*���m_��7.<.8����ϗ�2�ۛ��ؖ������.�}��<�\��H�#�G#щ��G��O��O)}4R:1R��H?Ϗ��⟗��c�P����oo���zz����#�.��7W�����Z�������1���q_��|F��}���ۋ�"�ۧC��ryʚ��W������/�ܞ������1������ն����Rݞߍ?{,����T��kŔ���?y�xq�����V�<y���
� +�g+Ԟ�Bmq��c�t��7�������p��C%�t���~<��)���?�O��;�_/����>\����Ԟ��c���0��i;��A���gt��/�~s{�����_������o�ײ�	��N^�i��U�~�,4R���J�����.?{]��u����}�(�)@d�)��5XG�a&=��K���Ez`=f����1.�7m3�2C0����X^:c����R~�p�(����+/�7��h0��>�C�ܵ#�D<gOj�� @,z�BA?�ޔ�z����0��Ű�dj��M�3ml[ �8L��L#�c�w�k�C�	NŃ�I����&3��W���7�$'�A�����`�E߳�İ�N^��Q;��A�<���2^ؒ���F��t���`�NS^.k��]�Y�H���`'���HF�J�j1N5�K� ʔ�Ũ��st��j��/)R���̧��޴���=W�/%8u�*��z���4�K���3�s��m��~��0�)�i�x4���u*��+�Mi*��cC���X�l���`~S�n�M���q��/�(4az�Vi)��xϽ$�Lo�0k3\�i���uQ��	��I�Dӛ�Cr_Jo�9L��ך�{�/b�h�|oq7�^YIo*�+A�`zSo�(�7��T�<iC�m~Hfck�!��q?5�H"��D!xiC[����a�����-�7U���|+0��NŵU\o0��չq�R���l[f�G �z�vyIhCs�#Iv��4,4?+R{ԃ9S�W��7Q��Y�M��w��RG��]��u0�i��f�R�0�OS�T)����DkK!�ljS�<=����K�#���G��r0)r[:f<5��t�@Q���H{��I��$km��=8������<�������yg����dp-�ӛƮ��m%��?�&H�
�� �G�]!�x8�ɨ`�S����7�ʐ�L���&�*�B�C��D�&��{�e�{_��o�i���_��㋔�n����͇�g�ϧ2���;r9����H�9z�����GS}H�I�]�ۧ�l}y����J^v������X�}��y�Y����K�yW�7�;���X����sw��Y��V����!ZK��e�ϒ����~�R[�j9ȼ�%�nu�OWkqQ�e�y?K"�����ZZ�k9ʼˋͻ<y�~p%<�$�������?��5ˬ_�N+O߻^
�[,��r�Zy����Rx�b����������[����V��w?����j��l��������V+/g�����/E�]�V+/g�m������K�y��V^�V�&�)9x)<o�����j�d>�������k���y6���O\�\l��r6�<�Om�'��g.V[y9�mVY�E���7�����m�l~��[�ɋXn��,�i6���O\ϼ}�LmL��/D���-���֏�o?7��+��q��������ϲ������y�nٿ[����e�nٿ[����e�nٿ[����������W+�>�)1|�u�k]J�N}��ƕ3:�^�6r�ӛ/�>����۷c�6���L��Ӷ�'������;��~�[Ќ��w�!��`�����r�]}8�(��P��OG�-�{:�j����G� ��Y��t4��Q'�>�9���� ��N���-�vIͩ<����u��1�`��is���V�م��^f==b�����>n;�#���W��	��Oi�Sj��x}��^����sKr�5���z`�<j�|�}��c��0�#��3��H��F~$:�#?�y����<�ȏ�0�a�Gb�0�g{#�#?���?�;�X��F�l��c1�g�������a���>{��?�;�X�F���l��f߽��k�{J��u�����w��]_}�W��?�uy��__�����w��_}�W���w�l#�������#��;}M�zy����������/����^      +   �  x����n�@�y
ĵ���.�}�HQ�Z�D$@��(�^�4�Sn��~G<Ì���M�i�b�l�2��6o�v;�.��O!\�����nn�̺�>�]���9C��i��b��ژ�z:&6���.tW�t�tL�cm�tN��ۿ�/ðq�6�ېWm�9���I�K�nXa�l�^�m�mۯ���b�;�w�o���y���O�����{�_����a7ow��q��?yzz|������������o��+�=�2{�PhO[hO,��+��/�g(�'ړ�)�C�<H�� ʃT(R�<H�� ʃT(R�<H�� ʃ\(��σ�i����4O��s)} 2 2 2 2 �`��b@d@d@d@d���2 2 2 2 2`u�ȀȀȀȀX�;d@d@d@d@�΀=2 2 2 2 Vg�������3`b@d@d@d@d��������:�ȀȀȀX��	a@d@d@d@�΀ɝd@d@d@d���N2 2 2 2`}t'�����>�ȀȀȀX�{d@d@d@d@�΀�0 2 2 2 �g@wB�����3�;!ȀȀȀȀ�Нd@d@d@d���N2 2 2 2`u��0 2 2 2 �g@wB����k2���f5��~xm�      -   �  x���Mr#���է��:� �`6���&iU[�i�L-���'�L�)�)-���$X�ro-��Jh��ҎoI�u��8��?��^�8P
1�$����â�T�㾚q)$�I���I�#K�}�<	�X?(��#K�s"�C֑C#�P��w�]g��@�*�%�ك��v�t�	.�1Ԕ{ȅ{�W���[��6C!���t2�oS�pu_Y��r!���5r@��v���{.�͠���#؇��u��YC��z�h�0g_���d�0R&�3�rpv��(�%���R�r�zn�Ҵ�1��:C"b�-���o 0�����L� ���@�&�Ї琩�Pא��G�(¼�	��Q�<��@�o�9�y�Z%�,�`��Öiι�v!'�C	�"d�1��=�*O�=�aЅ2(4�W�Ʈ�>�>��-
d� (�sH���F�Vd
��L<BJ�W�QǸ$���gJ�D��L%˯sx��U�`���整�.��@!@�s �kI�Y�>F�7��%BvQ} ��x��ZkU����X��ȥ�Lm��"8~{� ��$�O�@H�8̲Bђ�K-7C=f�8��^�&��|����qF����C�d��oU�DH��+`V+oIrW�S��O�![�O](	�7�\f+)><~B�J*���P�9B�\;D��C�OFEJ��k� T� ��(�6���t�
*��/"�.@����ǄH�e�BjZ�Z��z�����H�$|�$��A���s��j5B��IH�l�E-���E�rz͐�ry0<3K�W�!�rcM��&^	�`{>m��2��uC&zHCy�u�'�q �{0	�Q�d�F��+K�|��2�����@'�ӭK9��Tr�Id߃�`=�V��
Yw[Ҋ\��FP��(^���G�1U��x763�.���P�X�]���*��!ǳO�v�(4�VgǇ��h$���b�h�M�܇�����!���h��w��=�P[��,<�W��nL���#��Ԁ`Hz��:-H�D�顥Rre������)��:y9���Y�qI��'^��y(X$B�S��/�2��8�&{ķ�i�T��� ii��e��,=ͪ����$����A�Ӭ�2�����R|y� #��ZP	hH�W���.s�?��� 0��q��Ӕ��.<J�Yvn Az�b"��ݪ�����7a���{�H���3&\�̌S*z�W��O��Tr���B��T�(m�0e���o$��u��d������d}2HD��G��#�t0�i;EbD�M7T$����'�X풡�tf{a d�԰�v$��0Y��6�������I���tŐ��l���!a��MfEj�c/V�B���V�]F��P�/� yR~��f@��>a>��#b2�D?`�Tja�ޚ|�'���;�h��J�'CF������ ��y���d �c�q��Y,��TP���A�$���j(Eƞ��<uQ�u]��?q�����~��>QrU%�^��(��4���{�!���wh��x�x2�W��°���h��>�Qd��yS�7c'�+��b>?Z��Pv�DJk��f!�f��D�I��U���1�OJ�z	����x�I�%�Ɔ��8B��,0�YBG����D��Ӻ��F�cl�E(5�0���Ps��L�B1Ū�V�d���7��H؉.�ьΦ|J��&u�S-}&&c�쩄j����9�>��a��=�׃@��B�(���:O���@�-��-
�)��.Z���.���a�b)�*yQJ��c�,fJ���Ua�� Xy��7�+JY> ��0}QJ�;���FM�R��C�	ۦc�Ҽz��l�.�̝Ψ�/R��Ӝ��^��B��a�u�$��֤>��]�̉�;�%�s�/R����d�S34�z�QO�'qHV�i5oӻ�,~Ő�Ez(��h���_Aݣ�r����-�4b<��@�	!�Q>�x�G[�Z�ט8^�`�B%�,Oe?���Z�b�!l/�:���e��������ZS��GDM"�,k��1�n_
�/!L��������L�B�^��,p�Z�R���GB([�<��)����F{�;Xw���{Ӊ�{G�_)���w�v9����[+���������\�      /   �  x�}�K��0��)f?����Q�2�?�P���^w� �,'�>�E@������;Hd��RZ)����)h��������W�L�o�	[�
E
L as�ƨ--R���ɾ/D����F�Q�pߟ6&��i��	�m]ݬ}���d#a�훘L�h�*X�I�ƶ�����V��	�}]�����,Y{&��v +�����[0�|�.��=��Y��t�,�O:��45��~ �<���)UC55Ц��Mϔ�ij�;<�6� �Dϴ����4���Qڋ��oϖ��?М�U+e�� ���?d02u����R݉��ʘԞm���	�3��G�F�3��E�ݙࡴS�+���i��M�Ewn϶�Q�fi��M�b ���o�eBl���?Hо�_���\�n��;	6_F	����	�����Ҵ���@�����fm���O�N��m���ͮ�q��}]H��E:oC��Fm_��H��.�}�'���.���/�>�:���m�-Ks
�1Aɭ�H'�)��5*(M�UX�M��֨}�'�9�k
�Q!���t�Z�p��?��T�.X����4R�:9i��&��\���@���ˆֈ��	D8�.X�A���ф��`�����?��s�     